const mongoose = require('mongoose');
const Category = require('./Category');

const budgetSchema = new mongoose.Schema({
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

// Validate that category is of type EXPENSE before saving
budgetSchema.pre('save', async function (next) {
  try {
    // Only validate if category is being set or modified
    if (this.isNew || this.isModified('category')) {
      const category = await Category.findById(this.category);
      
      if (!category) {
        return next(new Error('Category not found'));
      }
      
      if (category.type !== 'EXPENSE') {
        return next(new Error('Budget can only be created for expense categories'));
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt field before saving
budgetSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

