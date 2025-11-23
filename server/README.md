# CashFlowX Server

Node.js Express server with MongoDB, JWT authentication, and email functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cashflowx

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=CashFlowX <your-email@gmail.com>

# SMTP Configuration (if not using Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081
```

3. Make sure MongoDB is running on your system or use MongoDB Atlas.

4. For Gmail, you'll need to:
   - Enable 2-factor authentication
   - Generate an App Password (not your regular password)
   - Use the App Password in `EMAIL_PASSWORD`

## Running

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js     # Auth logic (sign in, sign up, etc.)
├── models/
│   └── User.js              # User model with password hashing
├── routes/
│   └── auth.js              # Auth routes
├── utils/
│   └── email.js             # Email sending utility
├── index.js                 # Main server file
└── package.json
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint
- `GET /api` - API information endpoint

### Authentication Routes (`/api/auth`)

#### Sign In
- **POST** `/api/auth/sign-in`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Sign in successful",
    "data": {
      "user": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Sign Up
- **POST** `/api/auth/sign-up`
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "profileImageUrl": null
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "If the email exists, a temporary password has been sent"
  }
  ```

#### Verify Token
- **POST** `/api/auth/verify-token`
- **Body:**
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Token is valid",
    "data": {
      "user": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "profileImageUrl": "https://example.com/profile.jpg"
      },
      "token": "jwt_token_here"
    }
  }
  ```

## Features

- ✅ Password hashing with bcrypt
- ✅ JWT token generation and verification
- ✅ Email sending for temporary passwords
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration
- ✅ MongoDB integration with Mongoose

