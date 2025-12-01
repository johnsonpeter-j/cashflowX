const Budget = require('../models/Budget');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, subCategories, amount } = req.body;
    const userId = req.userId; // From auth middleware

    // Validate required fields
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    if (!amount || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be a positive number',
      });
    }

    // Verify that category exists and is EXPENSE type
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (categoryDoc.type !== 'EXPENSE') {
      return res.status(400).json({
        success: false,
        message: 'Budget can only be created for expense categories',
      });
    }

    // Validate subCategories if provided
    if (subCategories && Array.isArray(subCategories) && subCategories.length > 0) {
      // Verify all subCategories exist and belong to the parent category
      const subCategoryDocs = await SubCategory.find({
        _id: { $in: subCategories },
        parentCategory: category,
      });

      if (subCategoryDocs.length !== subCategories.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more sub-categories not found or do not belong to the selected category',
        });
      }
    }

    // Create new budget
    const budget = new Budget({
      category,
      subCategories: subCategories || [],
      amount,
      createdBy: userId,
    });

    await budget.save();

    // Populate related fields
    await budget.populate('createdBy', 'name email');
    await budget.populate('category', 'name type');
    await budget.populate('subCategories', 'name description');

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: {
        budget,
      },
    });
  } catch (error) {
    console.error('Create budget error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle custom error from pre-save hook
    if (error.message === 'Budget can only be created for expense categories') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating budget',
    });
  }
};

// Get all budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const { category } = req.query; // Optional filter by category

    let query = {};
    if (category) {
      query.category = category;
    }

    const budgets = await Budget.find(query)
      .populate('createdBy', 'name email')
      .populate('category', 'name type')
      .populate('subCategories', 'name description')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: 'Budgets retrieved successfully',
      data: {
        budgets,
        count: budgets.length,
      },
    });
  } catch (error) {
    console.error('Get all budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving budgets',
    });
  }
};

// Get a single budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id)
      .populate('createdBy', 'name email')
      .populate('category', 'name type')
      .populate('subCategories', 'name description');

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget retrieved successfully',
      data: {
        budget,
      },
    });
  } catch (error) {
    console.error('Get budget by ID error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving budget',
    });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subCategories, amount } = req.body;
    const userId = req.userId;

    // Find budget
    const budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check if user is the creator
    if (budget.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this budget',
      });
    }

    // Verify category if it's being updated
    if (category !== undefined) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      if (categoryDoc.type !== 'EXPENSE') {
        return res.status(400).json({
          success: false,
          message: 'Budget can only be created for expense categories',
        });
      }

      budget.category = category;

      // If category changed, validate subCategories belong to new category
      if (subCategories !== undefined && Array.isArray(subCategories) && subCategories.length > 0) {
        const subCategoryDocs = await SubCategory.find({
          _id: { $in: subCategories },
          parentCategory: category,
        });

        if (subCategoryDocs.length !== subCategories.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more sub-categories do not belong to the selected category',
          });
        }
        budget.subCategories = subCategories;
      } else if (subCategories !== undefined) {
        // If subCategories is explicitly set to empty array
        budget.subCategories = [];
      }
    } else if (subCategories !== undefined) {
      // Category not being updated, but subCategories are
      if (Array.isArray(subCategories) && subCategories.length > 0) {
        const subCategoryDocs = await SubCategory.find({
          _id: { $in: subCategories },
          parentCategory: budget.category,
        });

        if (subCategoryDocs.length !== subCategories.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more sub-categories do not belong to the selected category',
          });
        }
      }
      budget.subCategories = subCategories || [];
    }

    // Update amount
    if (amount !== undefined) {
      if (amount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      budget.amount = amount;
    }

    await budget.save();

    // Populate related fields
    await budget.populate('createdBy', 'name email');
    await budget.populate('category', 'name type');
    await budget.populate('subCategories', 'name description');

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        budget,
      },
    });
  } catch (error) {
    console.error('Update budget error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle custom error from pre-save hook
    if (error.message === 'Budget can only be created for expense categories') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating budget',
    });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find budget
    const budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found',
      });
    }

    // Check if user is the creator
    if (budget.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this budget',
      });
    }

    await Budget.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    console.error('Delete budget error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting budget',
    });
  }
};










