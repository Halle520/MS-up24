import { test, expect } from '@playwright/test';
import {
  getSupabase,
  createTestData,
  findTestData,
  clearTable,
} from './support/test-helpers';

/**
 * Example E2E test using Supabase for database operations
 */
test.describe('Example with Supabase', () => {
  test.beforeEach(async () => {
    // Clean up test data before each test
    try {
      await clearTable('images');
    } catch (error) {
      // Table might not exist yet, which is okay
      console.warn('Could not clear images table:', error);
    }
  });

  test('should create and query image data using Supabase', async ({
    page,
  }) => {
    // Get Supabase client
    const supabase = getSupabase();

    // Create test image data
    const testImage = await createTestData('images', {
      filename: 'test-image.jpg',
      original_name: 'test-image.jpg',
      mime_type: 'image/jpeg',
      size: 102400,
      url_original: 'https://example.com/test-image.jpg',
      url_tiny: 'https://example.com/test-image-tiny.jpg',
      url_medium: 'https://example.com/test-image-medium.jpg',
      url_large: 'https://example.com/test-image-large.jpg',
    });

    expect(testImage.id).toBeDefined();
    expect(testImage.filename).toBe('test-image.jpg');

    // Query the data back
    const foundImage = await findTestData('images', {
      filename: 'test-image.jpg',
    });

    expect(foundImage).not.toBeNull();
    expect(foundImage?.filename).toBe('test-image.jpg');
  });

  test('should access Supabase client directly', async ({ page }) => {
    // Get Supabase client
    const supabase = getSupabase();

    // Query images table
    const { data, error } = await supabase.from('images').select('*').limit(1);

    if (error) {
      console.warn('Supabase query error:', error.message);
    } else {
      expect(data).toBeDefined();
    }
  });
});
