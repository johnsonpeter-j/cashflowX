import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const requiredStringSchema = z.string().min(1, 'This field is required');

// Common validation schemas that can be reused
export const validationSchemas = {
  email: emailSchema,
  password: passwordSchema,
  requiredString: requiredStringSchema,
  
  // Amount validation
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  
  // Date validation
  date: z.string().min(1, 'Date is required'),
  
  // Optional email
  optionalEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
};

// Helper function to get error message from zod error
export function getErrorMessage(error: any): string | undefined {
  if (error?.issues?.[0]?.message) {
    return error.issues[0].message;
  }
  return undefined;
}

// Helper to validate a single field
export async function validateField(schema: z.ZodSchema, value: any): Promise<string | undefined> {
  try {
    await schema.parseAsync(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return 'Invalid value';
  }
}





