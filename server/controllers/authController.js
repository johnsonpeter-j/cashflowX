const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const { sendTempPasswordEmail } = require('../utils/email');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Sign In
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are in request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send user details along with JWT token
    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl || null,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while signing in',
    });
  }
};

// Sign Up
exports.signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if name, email, password and confirmPassword are in request body
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and confirm password are required',
      });
    }

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    // Check if user already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send user details along with JWT token
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl || null,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
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
      message: 'An error occurred while creating user',
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is in request body
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a temporary password has been sent',
      });
    }

    // Generate temporary password (8 characters, alphanumeric)
    const generateTempPassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let tempPassword = '';
      for (let i = 0; i < 8; i++) {
        tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return tempPassword;
    };

    const tempPassword = generateTempPassword();

    // Save temporary password to database (will be hashed by pre-save hook)
    user.tempPassword = tempPassword;
    await user.save();

    // Send temporary password to user through email
    try {
      await sendTempPasswordEmail(user.email, tempPassword);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still return success but log the error
      // In production, you might want to handle this differently
    }

    // Return success response (for security, don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: 'If the email exists, a temporary password has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
};

// Verify Token
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Check if token is in request body
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Check if user exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Send user details along with JWT token
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImageUrl: user.profileImageUrl || null,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying token',
    });
  }
};

