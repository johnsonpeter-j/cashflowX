const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// All transaction routes require authentication
router.use(authenticate);

// Create a new transaction
router.post('/', createTransaction);

// Get all transactions (optional queries: ?type=INCOME|EXPENSE&category=categoryId&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)
router.get('/', getAllTransactions);

// Get a single transaction by ID
router.get('/:id', getTransactionById);

// Update a transaction
router.put('/:id', updateTransaction);

// Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;










