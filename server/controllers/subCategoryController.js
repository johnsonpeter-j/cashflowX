const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

// Create a new sub-category
exports.createSubCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    const userId = req.userId; // From auth middleware

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Sub-category name is required',
      });
    }

    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Parent category is required',
      });
    }

    // Verify that parent category exists
    const parent = await Category.findById(parentCategory);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent category not found',
      });
    }

    // Create new sub-category
    const subCategory = new SubCategory({
      name,
      description: description || '',
      parentCategory,
      createdBy: userId,
    });

    await subCategory.save();

    // Populate related fields
    await subCategory.populate('createdBy', 'name email');
    await subCategory.populate('parentCategory', 'name type');

    res.status(201).json({
      success: true,
      message: 'Sub-category created successfully',
      data: {
        subCategory,
      },
    });
  } catch (error) {
    console.error('Create sub-category error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating sub-category',
    });
  }
};

// Get all sub-categories
exports.getAllSubCategories = async (req, res) => {
  try {
    const { parentCategory } = req.query; // Optional filter by parent category

    let query = {};
    if (parentCategory) {
      query.parentCategory = parentCategory;
    }

    const subCategories = await SubCategory.find(query)
      .populate('createdBy', 'name email')
      .populate('parentCategory', 'name type')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: 'Sub-categories retrieved successfully',
      data: {
        subCategories,
        count: subCategories.length,
      },
    });
  } catch (error) {
    console.error('Get all sub-categories error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving sub-categories',
    });
  }
};

// Get a single sub-category by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findById(id)
      .populate('createdBy', 'name email')
      .populate('parentCategory', 'name type');

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sub-category retrieved successfully',
      data: {
        subCategory,
      },
    });
  } catch (error) {
    console.error('Get sub-category by ID error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sub-category ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving sub-category',
    });
  }
};

// Update a sub-category
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory } = req.body;
    const userId = req.userId;

    // Find sub-category
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found',
      });
    }

    // Check if user is the creator (optional: you might want to allow admins to update any sub-category)
    if (subCategory.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this sub-category',
      });
    }

    // Verify parent category if it's being updated
    if (parentCategory !== undefined) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found',
        });
      }
      subCategory.parentCategory = parentCategory;
    }

    // Update fields
    if (name !== undefined) {
      subCategory.name = name;
    }
    if (description !== undefined) {
      subCategory.description = description;
    }

    await subCategory.save();

    // Populate related fields
    await subCategory.populate('createdBy', 'name email');
    await subCategory.populate('parentCategory', 'name type');

    res.status(200).json({
      success: true,
      message: 'Sub-category updated successfully',
      data: {
        subCategory,
      },
    });
  } catch (error) {
    console.error('Update sub-category error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sub-category ID',
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

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating sub-category',
    });
  }
};

// Delete a sub-category
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find sub-category
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub-category not found',
      });
    }

    // Check if user is the creator (optional: you might want to allow admins to delete any sub-category)
    if (subCategory.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this sub-category',
      });
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Sub-category deleted successfully',
    });
  } catch (error) {
    console.error('Delete sub-category error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid sub-category ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting sub-category',
    });
  }
};










