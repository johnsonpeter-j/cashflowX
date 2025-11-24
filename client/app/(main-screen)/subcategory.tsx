import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function SubcategoryScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="heading1">Subcategory</ThemedText>
      <ThemedText type="secondary">Subcategory screen coming soon...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
});

