import { supabase } from './supabaseClient';
import { User } from './types';

/**
 * AuthService class that handles authentication operations for the AI Website Builder platform.
 */
class AuthService {
  /**
   * Signs up a new user with email and password
   * @param email - User email
   * @param password - User password
   * @param fullName - User's full name (optional)
   * @returns The user data or null if signup failed
   */
  public async signUp(email: string, password: string, fullName?: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        console.error('Error signing up:', error);
        return null;
      }

      return data.user as unknown as User;
    } catch (error) {
      console.error('Exception signing up:', error);
      return null;
    }
  }

  /**
   * Signs in a user with email and password
   * @param email - User email
   * @param password - User password
   * @returns The user data or null if signin failed
   */
  public async signIn(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        return null;
      }

      return data.user as unknown as User;
    } catch (error) {
      console.error('Exception signing in:', error);
      return null;
    }
  }

  /**
   * Signs out the current user
   * @returns True if signout was successful, false otherwise
   */
  public async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception signing out:', error);
      return false;
    }
  }

  /**
   * Gets the current user
   * @returns The current user or null if not authenticated
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error('Error getting current user:', error);
        return null;
      }

      return data.user as unknown as User;
    } catch (error) {
      console.error('Exception getting current user:', error);
      return null;
    }
  }

  /**
   * Sends a password reset email
   * @param email - Email address to send reset link to
   * @returns True if email was sent successfully, false otherwise
   */
  public async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('Error resetting password:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception resetting password:', error);
      return false;
    }
  }

  /**
   * Updates the current user's password
   * @param newPassword - New password
   * @returns True if update was successful, false otherwise
   */
  public async updatePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Error updating password:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception updating password:', error);
      return false;
    }
  }

  /**
   * Updates the current user's profile
   * @param updates - Object containing profile fields to update
   * @returns The updated user or null if update failed
   */
  public async updateProfile(updates: { fullName?: string; avatarUrl?: string }): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
        },
      });

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      return data.user as unknown as User;
    } catch (error) {
      console.error('Exception updating profile:', error);
      return null;
    }
  }

  /**
   * Sets up auth state change listener
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  public onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as unknown as User || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }
}

export default AuthService;
