const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { name, type, category, subCategories, amount, transactionOn } = req.body;
    const userId = req.userId; // From auth middleware

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Transaction name is required',
      });
    }

    if (!type || !['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Transaction type is required and must be either INCOME or EXPENSE',
      });
    }

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

    if (!transactionOn) {
      return res.status(400).json({
        success: false,
        message: 'Transaction date is required',
      });
    }

    // Verify that category exists and type matches
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (categoryDoc.type !== type) {
      return res.status(400).json({
        success: false,
        message: `Category type (${categoryDoc.type}) must match transaction type (${type})`,
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

    // Create new transaction
    const transaction = new Transaction({
      name,
      type,
      category,
      subCategories: subCategories || [],
      amount,
      transactionOn: new Date(transactionOn),
      createdBy: userId,
    });

    await transaction.save();

    // Populate related fields
    await transaction.populate('createdBy', 'name email');
    await transaction.populate('category', 'name type');
    await transaction.populate('subCategories', 'name description');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    // Handle custom error from pre-save hook
    if (error.message && error.message.includes('Category type')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating transaction',
    });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query; // Optional filters

    let query = {};
    
    if (type && ['INCOME', 'EXPENSE'].includes(type)) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.transactionOn = {};
      if (startDate) {
        query.transactionOn.$gte = new Date(startDate);
      }
      if (endDate) {
        query.transactionOn.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(query)
      .populate('createdBy', 'name email')
      .populate('category', 'name type')
      .populate('subCategories', 'name description')
      .sort({ transactionOn: -1, createdAt: -1 }); // Sort by transaction date (newest first), then by creation date

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        count: transactions.length,
      },
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving transactions',
    });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate('createdBy', 'name email')
      .populate('category', 'name type')
      .populate('subCategories', 'name description');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving transaction',
    });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, category, subCategories, amount, transactionOn } = req.body;
    const userId = req.userId;

    // Find transaction
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check if user is the creator
    if (transaction.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this transaction',
      });
    }

    // Verify category and type if being updated
    if (category !== undefined || type !== undefined) {
      const categoryId = category || transaction.category;
      const transactionType = type || transaction.type;

      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      if (categoryDoc.type !== transactionType) {
        return res.status(400).json({
          success: false,
          message: `Category type (${categoryDoc.type}) must match transaction type (${transactionType})`,
        });
      }

      if (category !== undefined) {
        transaction.category = category;
      }
      if (type !== undefined) {
        transaction.type = type;
      }

      // If category changed, validate subCategories belong to new category
      if (subCategories !== undefined && Array.isArray(subCategories) && subCategories.length > 0) {
        const subCategoryDocs = await SubCategory.find({
          _id: { $in: subCategories },
          parentCategory: categoryId,
        });

        if (subCategoryDocs.length !== subCategories.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more sub-categories do not belong to the selected category',
          });
        }
        transaction.subCategories = subCategories;
      } else if (subCategories !== undefined) {
        // If subCategories is explicitly set to empty array
        transaction.subCategories = [];
      }
    } else if (subCategories !== undefined) {
      // Category not being updated, but subCategories are
      if (Array.isArray(subCategories) && subCategories.length > 0) {
        const subCategoryDocs = await SubCategory.find({
          _id: { $in: subCategories },
          parentCategory: transaction.category,
        });

        if (subCategoryDocs.length !== subCategories.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more sub-categories do not belong to the selected category',
          });
        }
      }
      transaction.subCategories = subCategories || [];
    }

    // Update other fields
    if (name !== undefined) {
      transaction.name = name;
    }
    if (amount !== undefined) {
      if (amount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      transaction.amount = amount;
    }
    if (transactionOn !== undefined) {
      transaction.transactionOn = new Date(transactionOn);
    }

    await transaction.save();

    // Populate related fields
    await transaction.populate('createdBy', 'name email');
    await transaction.populate('category', 'name type');
    await transaction.populate('subCategories', 'name description');

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
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
    if (error.message && error.message.includes('Category type')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating transaction',
    });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find transaction
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check if user is the creator
    if (transaction.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this transaction',
      });
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting transaction',
    });
  }
};










