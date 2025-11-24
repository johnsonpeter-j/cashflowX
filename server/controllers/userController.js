const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Helper function to get the URL for the uploaded file
const getFileUrl = (filename) => {
  if (!filename) return null;
  return `/uploads/profile/${filename}`;
};

// Helper function to get full URL for profile image
const getFullProfileImageUrl = (profileImageUrl) => {
  if (!profileImageUrl) return null;
  
  // If already a full URL (starts with http), return as is
  if (profileImageUrl.startsWith('http://') || profileImageUrl.startsWith('https://')) {
    return profileImageUrl;
  }
  
  // Get BASE_URL from environment variable
  const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  
  // Remove trailing slash from BASE_URL if present
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  
  // Ensure profileImageUrl starts with /
  const imagePath = profileImageUrl.startsWith('/') ? profileImageUrl : `/${profileImageUrl}`;
  
  return `${baseUrl}${imagePath}`;
};

// Helper function to delete old profile image
const deleteOldProfileImage = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract filename from URL
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, '../uploads/profile', filename);
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting old profile image:', error);
    // Don't throw error, just log it
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    const uploadedFile = req.file; // File uploaded via multer

    // Validate that at least one field is provided
    if (!name && !uploadedFile) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name or profileImage) is required',
      });
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters',
        });
      }
    }

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      // If file was uploaded but user not found, delete the uploaded file
      if (uploadedFile) {
        const filePath = path.join(__dirname, '../uploads/profile', uploadedFile.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update name if provided
    if (name !== undefined) {
      user.name = name.trim();
    }

    // Handle profile image upload
    if (uploadedFile) {
      // Delete old profile image if it exists
      if (user.profileImageUrl) {
        deleteOldProfileImage(user.profileImageUrl);
      }
      
      // Set new profile image URL
      user.profileImageUrl = getFileUrl(uploadedFile.filename);
    }

    await user.save();

    // Return updated user (password and tempPassword are excluded by toJSON method)
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: getFullProfileImageUrl(user.profileImageUrl),
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // If file was uploaded but error occurred, delete the uploaded file
    if (req.file) {
      try {
        const filePath = path.join(__dirname, '../uploads/profile', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (deleteError) {
        console.error('Error deleting uploaded file after error:', deleteError);
      }
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
      message: 'An error occurred while updating profile',
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirm password are required',
      });
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match',
      });
    }

    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    // Validate that new password is different from current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    
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
      message: 'An error occurred while changing password',
    });
  }
};

