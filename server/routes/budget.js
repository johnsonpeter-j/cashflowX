const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

// All budget routes require authentication
router.use(authenticate);

// Create a new budget
router.post('/', createBudget);

// Get all budgets (optional query: ?category=categoryId)
router.get('/', getAllBudgets);

// Get a single budget by ID
router.get('/:id', getBudgetById);

// Update a budget
router.put('/:id', updateBudget);

// Delete a budget
router.delete('/:id', deleteBudget);

module.exports = router;










