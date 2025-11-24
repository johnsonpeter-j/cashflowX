import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActionSheetIOS } from 'react-native';
import { useState, useRef } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, TextInput } from '@/components/ui';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { globalStyles } from '@/styles/global';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/use-form';
import { z } from 'zod';
import { validationSchemas } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppDispatch } from '@/store/hooks';
import { updateProfileThunk } from '@/store/user/user.thunk';
import { API_BASE_URL } from '@/types/api';
import * as ImagePicker from 'expo-image-picker';

// Profile form validation schema
const profileSchema = z.object({
  name: validationSchemas.requiredString.min(2, 'Name must be at least 2 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { isMobile, isTablet, isLaptop } = useResponsive();
  const isDark = colorScheme === 'dark';
  const { user, token, updateUser } = useAuth();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { values, errors, isSubmitting, setValue, handleSubmit, getFieldError } = useForm<ProfileFormData>({
    initialValues: {
      name: user?.name || '',
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        if (!token) {
          toast.showError('Authentication required. Please sign in again.');
          return;
        }

        const result = await dispatch(
          updateProfileThunk({
            data: {
              name: values.name,
              profileImage: selectedImage,
            },
            token,
          })
        ).unwrap();

        // Update local state
        updateUser(result.user);
        setSelectedImage(null);
        toast.showSuccess('Profile updated successfully!');
        // Explicitly return to prevent any navigation
        return;
      } catch (error: any) {
        console.error('Profile update error:', error);
        toast.showError(error || 'Failed to update profile. Please try again.');
        // Explicitly return to prevent any navigation
        return;
      }
    },
  });

  const requestImagePickerPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload profile pictures!',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos!',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    // For web, use native file input
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }

    const hasPermission = await requestImagePickerPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      toast.showError('Failed to pick image. Please try again.');
    }
  };

  const handleWebFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.showError('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.showError('Image size must be less than 5MB.');
        return;
      }

      // Create preview URL and set selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          uri: reader.result as string,
          type: file.type,
          name: file.name,
          file: file, // Keep the file object for upload
        });
      };
      reader.readAsDataURL(file);
    }

    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const takePhoto = async () => {
    // For web, camera is not directly supported, show info message
    if (Platform.OS === 'web') {
      toast.showInfo('Camera is not available on web. Please choose an image from your library.');
      return;
    }

    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.showError('Failed to take photo. Please try again.');
    }
  };

  const handleImagePicker = () => {
    if (Platform.OS === 'web') {
      // For web, directly open file picker
      pickImageFromGallery();
    } else if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      // Android - show alert with options
      Alert.alert(
        'Select Profile Picture',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImageFromGallery },
        ]
      );
    }
  };

  // Responsive container width
  const containerMaxWidth = isMobile ? '100%' : isTablet ? 600 : 500;
  const horizontalPadding = isMobile ? Spacing.md : isTablet ? Spacing.lg : Spacing.xl;

  return (
    <ThemedView style={[globalStyles.container, isDark && globalStyles.containerDark]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { maxWidth: containerMaxWidth, alignSelf: 'center', width: '100%' }]}>
            {/* Header Section */}
            <View style={styles.header}>
              <ThemedText type="heading1" style={[styles.title, globalStyles.marginBottomSm]}>
                Profile
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Update your profile information
              </ThemedText>
            </View>

            {/* Profile Card */}
            <ThemedView style={[globalStyles.card, isDark && globalStyles.cardDark, styles.profileCard]}>
              {/* Hidden file input for web */}
              {Platform.OS === 'web' && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleWebFileSelect}
                />
              )}
              {/* Profile Picture Section */}
              <View style={styles.profilePictureSection}>
                {selectedImage?.uri ? (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.profileImage}
                    contentFit="cover"
                  />
                ) : user?.profileImageUrl ? (
                  <Image
                    source={{ uri: user.profileImageUrl.startsWith('http') ? user.profileImageUrl : `${API_BASE_URL}${user.profileImageUrl}` }}
                    style={styles.profileImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.profileImage, styles.profileImagePlaceholder, { backgroundColor: Colors.light.primary }]}>
                    <ThemedText type="heading2" style={styles.profileImageText}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.imagePickerButton,
                    {
                      backgroundColor: isDark ? Colors.dark.backgroundSecondary : Colors.light.background,
                      borderColor: isDark ? Colors.dark.border : Colors.light.border,
                    },
                  ]}
                  onPress={handleImagePicker}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name="camera"
                    size={20}
                    color={isDark ? Colors.dark.icon : Colors.light.icon}
                  />
                </TouchableOpacity>
                {selectedImage?.uri && (
                  <TouchableOpacity
                    style={[
                      styles.removeImageButton,
                      {
                        backgroundColor: Colors.light.error,
                      },
                    ]}
                    onPress={() => setSelectedImage(null)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      name="xmark"
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Form Fields */}
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                required
                autoCapitalize="words"
                value={values.name}
                onChangeText={(text) => setValue('name', text)}
                error={getFieldError('name')}
              />

              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={user?.email || ''}
                editable={false}
                style={styles.disabledInput}
              />

              {/* Save Button */}
              <Button
                title={isSubmitting ? 'Saving...' : 'Save Changes'}
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
                onPress={(e) => {
                  // Prevent default behavior on web
                  if (Platform.OS === 'web' && e) {
                    e.preventDefault?.();
                  }
                  handleSubmit();
                }}
                style={[globalStyles.marginTopMd, globalStyles.marginBottomMd]}
              />
            </ThemedView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Spacing.xl,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
  },
  profileImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    color: '#FFFFFF',
    fontSize: 48,
  },
  imagePickerButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledInput: {
    opacity: 0.6,
  },
});

