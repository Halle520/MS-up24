/**
 * Image entity for database storage
 * This represents the structure of the images table in Supabase
 */
export interface ImageEntity {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url_tiny?: string;
  url_medium?: string;
  url_large?: string;
  url_original: string;
  user_id?: string;
  uploaded_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Create image DTO for database insertion
 */
export interface CreateImageDto {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  url_tiny?: string;
  url_medium?: string;
  url_large?: string;
  url_original: string;
  user_id?: string;
}
