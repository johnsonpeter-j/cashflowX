import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function BudgetScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="heading1">Budget</ThemedText>
      <ThemedText type="secondary">Budget screen coming soon...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
});









