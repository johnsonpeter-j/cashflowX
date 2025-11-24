import { API_BASE_URL, ApiResponse, AuthResponse, ForgotPasswordRequest, SignInRequest, SignUpRequest, VerifyTokenRequest, UpdateProfileRequest, ChangePasswordRequest, User } from "@/types/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signInThunk = createAsyncThunk<
  AuthResponse,
  SignInRequest,
  { rejectValue: string }
>('auth/signIn', async (data, { rejectWithValue }) => {
  try {
    console.log('signInThunk called with:', { email: data.email, password: '***' });
    console.log('API_BASE_URL:', API_BASE_URL);
    const url = `${API_BASE_URL}/api/auth/sign-in`;
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response data:', result);

    if (!response.ok) {
      console.log('Response not OK, rejecting with:', result.message || 'Sign in failed');
      return rejectWithValue(result.message || 'Sign in failed');
    }

    if (!result.data) {
      console.log('No data in response, rejecting');
      return rejectWithValue('Invalid response from server');
    }

    console.log('Sign in successful, returning data');
    return result.data;
  } catch (error) {
    console.error('Sign in error:', error);
    return rejectWithValue(
      'An error occurred while signing in. Please check your connection and try again.'
    );
  }
});

export const signUpThunk = createAsyncThunk<
  AuthResponse,
  SignUpRequest,
  { rejectValue: string }
>('auth/signUp', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Sign up failed');
    }

    if (!result.data) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Sign up error:', error);
    return rejectWithValue(
      'An error occurred while signing up. Please check your connection and try again.'
    );
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  ApiResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to send temporary password');
    }

    return {
      success: true,
      message: result.message || 'A temporary password has been sent to your email address',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return rejectWithValue(
      'An error occurred. Please check your connection and try again.'
    );
  }
});

export const verifyTokenThunk = createAsyncThunk<
  AuthResponse,
  VerifyTokenRequest,
  { rejectValue: string }
>('auth/verifyToken', async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Token verification failed');
    }

    if (!result.data) {
      return rejectWithValue('Invalid response from server');
    }

    return result.data;
  } catch (error) {
    console.error('Verify token error:', error);
    return rejectWithValue(
      'An error occurred while verifying token. Please check your connection and try again.'
    );
  }
});

// Update Profile Thunk
export const updateProfileThunk = createAsyncThunk<
  { user: User },
  { data: UpdateProfileRequest; token: string },
  { rejectValue: string }
>('auth/updateProfile', async ({ data, token }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    
    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    
    if (data.profileImage) {
      // For React Native, we need to handle the file differently
      // The file should be an object with uri, type, and name
      const file = data.profileImage as any;
      
      // Check if it's a web File object
      if (file instanceof File) {
        // Web file format - direct File object
        formData.append('profileImage', file);
      } else if (file.file instanceof File) {
        // Web file format - File object stored in file property
        formData.append('profileImage', file.file);
      } else if (file.uri) {
        // React Native file format
        // FormData in React Native expects an object with uri, type, and name
        formData.append('profileImage', {
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || 'profile.jpg',
        } as any);
      } else if (file instanceof Blob) {
        // Web Blob format
        formData.append('profileImage', file, 'profile.jpg');
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData in React Native
        // The fetch API will automatically set it with the correct boundary
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to update profile');
    }

    if (!result.data || !result.data.user) {
      return rejectWithValue('Invalid response from server');
    }

    // Ensure profileImageUrl is a full URL if it's a relative path
    const user = result.data.user;
    if (user.profileImageUrl && !user.profileImageUrl.startsWith('http')) {
      user.profileImageUrl = `${API_BASE_URL}${user.profileImageUrl}`;
    }

    return { user };
  } catch (error) {
    console.error('Update profile error:', error);
    return rejectWithValue(
      'An error occurred while updating profile. Please check your connection and try again.'
    );
  }
});

// Change Password Thunk
export const changePasswordThunk = createAsyncThunk<
  ApiResponse,
  { data: ChangePasswordRequest; token: string },
  { rejectValue: string }
>('auth/changePassword', async ({ data, token }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.message || 'Failed to change password');
    }

    return {
      success: true,
      message: result.message || 'Password changed successfully',
    };
  } catch (error) {
    console.error('Change password error:', error);
    return rejectWithValue(
      'An error occurred while changing password. Please check your connection and try again.'
    );
  }
});

