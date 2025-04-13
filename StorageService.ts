import { supabase } from './supabaseClient';

/**
 * StorageService class that handles file storage operations for the AI Website Builder platform.
 */
class StorageService {
  /**
   * Uploads a file to Supabase storage
   * @param bucket - Storage bucket name
   * @param path - File path within the bucket
   * @param file - File to upload
   * @returns The file URL or null if upload failed
   */
  public async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Exception uploading file:', error);
      return null;
    }
  }

  /**
   * Downloads a file from Supabase storage
   * @param bucket - Storage bucket name
   * @param path - File path within the bucket
   * @returns The file data or null if download failed
   */
  public async downloadFile(bucket: string, path: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) {
        console.error('Error downloading file:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception downloading file:', error);
      return null;
    }
  }

  /**
   * Lists files in a bucket
   * @param bucket - Storage bucket name
   * @param path - Path within the bucket
   * @returns Array of file objects or empty array if listing failed
   */
  public async listFiles(bucket: string, path: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path);

      if (error) {
        console.error('Error listing files:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception listing files:', error);
      return [];
    }
  }

  /**
   * Deletes a file from Supabase storage
   * @param bucket - Storage bucket name
   * @param path - File path within the bucket
   * @returns True if deletion was successful, false otherwise
   */
  public async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting file:', error);
      return false;
    }
  }

  /**
   * Creates a signed URL for temporary access to a file
   * @param bucket - Storage bucket name
   * @param path - File path within the bucket
   * @param expiresIn - Expiration time in seconds
   * @returns The signed URL or null if creation failed
   */
  public async createSignedUrl(bucket: string, path: string, expiresIn: number = 60): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Exception creating signed URL:', error);
      return null;
    }
  }

  /**
   * Creates a new storage bucket
   * @param bucketName - Name for the new bucket
   * @param isPublic - Whether the bucket should be public
   * @returns True if creation was successful, false otherwise
   */
  public async createBucket(bucketName: string, isPublic: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic
      });

      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception creating bucket:', error);
      return false;
    }
  }
}

export default StorageService;
