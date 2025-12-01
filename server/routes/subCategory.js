const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} = require('../controllers/subCategoryController');

// All sub-category routes require authentication
router.use(authenticate);

// Create a new sub-category
router.post('/', createSubCategory);

// Get all sub-categories (optional query: ?parentCategory=categoryId)
router.get('/', getAllSubCategories);

// Get a single sub-category by ID
router.get('/:id', getSubCategoryById);

// Update a sub-category
router.put('/:id', updateSubCategory);

// Delete a sub-category
router.delete('/:id', deleteSubCategory);

module.exports = router;










