import { supabase } from './supabaseClient';
import { User, Project, Component, Deployment } from './types';

/**
 * DatabaseService class that handles all database operations for the AI Website Builder platform.
 */
class DatabaseService {
  /**
   * Creates a new project in the database
   * @param name - Project name
   * @param description - Project description
   * @param userId - User ID who owns the project
   * @returns The created project or null if creation failed
   */
  public async createProject(name: string, description: string, userId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name,
            description,
            user_id: userId,
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return null;
      }

      return data as Project;
    } catch (error) {
      console.error('Exception creating project:', error);
      return null;
    }
  }

  /**
   * Gets a project by ID
   * @param projectId - Project ID to retrieve
   * @returns The project or null if not found
   */
  public async getProject(projectId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error getting project:', error);
        return null;
      }

      return data as Project;
    } catch (error) {
      console.error('Exception getting project:', error);
      return null;
    }
  }

  /**
   * Gets all projects for a user
   * @param userId - User ID to get projects for
   * @returns Array of projects or empty array if none found
   */
  public async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error getting user projects:', error);
        return [];
      }

      return data as Project[];
    } catch (error) {
      console.error('Exception getting user projects:', error);
      return [];
    }
  }

  /**
   * Updates a project
   * @param projectId - Project ID to update
   * @param updates - Object containing fields to update
   * @returns The updated project or null if update failed
   */
  public async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return null;
      }

      return data as Project;
    } catch (error) {
      console.error('Exception updating project:', error);
      return null;
    }
  }

  /**
   * Deletes a project
   * @param projectId - Project ID to delete
   * @returns True if deletion was successful, false otherwise
   */
  public async deleteProject(projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting project:', error);
      return false;
    }
  }

  /**
   * Creates a new component in the database
   * @param projectId - Project ID the component belongs to
   * @param name - Component name
   * @param type - Component type
   * @param code - Component code
   * @param filePath - File path for the component
   * @returns The created component or null if creation failed
   */
  public async createComponent(
    projectId: string,
    name: string,
    type: Component['type'],
    code: string,
    filePath: string
  ): Promise<Component | null> {
    try {
      const { data, error } = await supabase
        .from('components')
        .insert([
          {
            project_id: projectId,
            name,
            type,
            code,
            file_path: filePath
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating component:', error);
        return null;
      }

      return data as Component;
    } catch (error) {
      console.error('Exception creating component:', error);
      return null;
    }
  }

  /**
   * Gets all components for a project
   * @param projectId - Project ID to get components for
   * @returns Array of components or empty array if none found
   */
  public async getProjectComponents(projectId: string): Promise<Component[]> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error getting project components:', error);
        return [];
      }

      return data as Component[];
    } catch (error) {
      console.error('Exception getting project components:', error);
      return [];
    }
  }

  /**
   * Updates a component
   * @param componentId - Component ID to update
   * @param updates - Object containing fields to update
   * @returns The updated component or null if update failed
   */
  public async updateComponent(componentId: string, updates: Partial<Component>): Promise<Component | null> {
    try {
      const { data, error } = await supabase
        .from('components')
        .update(updates)
        .eq('id', componentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating component:', error);
        return null;
      }

      return data as Component;
    } catch (error) {
      console.error('Exception updating component:', error);
      return null;
    }
  }

  /**
   * Creates a new deployment record
   * @param projectId - Project ID to create deployment for
   * @param environment - Deployment environment
   * @returns The created deployment or null if creation failed
   */
  public async createDeployment(
    projectId: string,
    environment: Deployment['environment']
  ): Promise<Deployment | null> {
    try {
      const { data, error } = await supabase
        .from('deployments')
        .insert([
          {
            project_id: projectId,
            status: 'pending',
            environment
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating deployment:', error);
        return null;
      }

      return data as Deployment;
    } catch (error) {
      console.error('Exception creating deployment:', error);
      return null;
    }
  }

  /**
   * Updates a deployment record
   * @param deploymentId - Deployment ID to update
   * @param updates - Object containing fields to update
   * @returns The updated deployment or null if update failed
   */
  public async updateDeployment(deploymentId: string, updates: Partial<Deployment>): Promise<Deployment | null> {
    try {
      const { data, error } = await supabase
        .from('deployments')
        .update(updates)
        .eq('id', deploymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating deployment:', error);
        return null;
      }

      return data as Deployment;
    } catch (error) {
      console.error('Exception updating deployment:', error);
      return null;
    }
  }

  /**
   * Gets all deployments for a project
   * @param projectId - Project ID to get deployments for
   * @returns Array of deployments or empty array if none found
   */
  public async getProjectDeployments(projectId: string): Promise<Deployment[]> {
    try {
      const { data, error } = await supabase
        .from('deployments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting project deployments:', error);
        return [];
      }

      return data as Deployment[];
    } catch (error) {
      console.error('Exception getting project deployments:', error);
      return [];
    }
  }
}

export default DatabaseService;
