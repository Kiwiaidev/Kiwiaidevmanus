import { supabase } from './supabaseClient';
import DatabaseService from './DatabaseService';
import AuthService from './AuthService';
import StorageService from './StorageService';

/**
 * Main Supabase service that provides access to all Supabase-related functionality
 */
class SupabaseService {
  private databaseService: DatabaseService;
  private authService: AuthService;
  private storageService: StorageService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.authService = new AuthService();
    this.storageService = new StorageService();
  }

  /**
   * Get the database service instance
   */
  public get database(): DatabaseService {
    return this.databaseService;
  }

  /**
   * Get the auth service instance
   */
  public get auth(): AuthService {
    return this.authService;
  }

  /**
   * Get the storage service instance
   */
  public get storage(): StorageService {
    return this.storageService;
  }

  /**
   * Initialize Supabase buckets and other resources
   */
  public async initialize(): Promise<boolean> {
    try {
      // Create storage buckets if they don't exist
      await this.storageService.createBucket('project-assets', true);
      await this.storageService.createBucket('user-avatars', true);
      
      return true;
    } catch (error) {
      console.error('Error initializing Supabase service:', error);
      return false;
    }
  }

  /**
   * Get the raw Supabase client for direct access
   */
  public get client() {
    return supabase;
  }
}

// Export a singleton instance
const supabaseService = new SupabaseService();
export default supabaseService;
