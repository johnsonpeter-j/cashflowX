const mongoose = require('mongoose');
const Category = require('./Category');

const transactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Transaction name is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['INCOME', 'EXPENSE'],
    required: [true, 'Transaction type is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subCategories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SubCategory',
    default: [],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },
  transactionOn: {
    type: Date,
    required: [true, 'Transaction date is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by field is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Validate that category type matches transaction type before saving
transactionSchema.pre('save', async function (next) {
  try {
    // Only validate if category or type is being set or modified
    if (this.isNew || this.isModified('category') || this.isModified('type')) {
      const category = await Category.findById(this.category);
      
      if (!category) {
        return next(new Error('Category not found'));
      }
      
      if (category.type !== this.type) {
        return next(new Error(`Category type (${category.type}) must match transaction type (${this.type})`));
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt field before saving
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;










