import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Get all components for a project
  // POST: Create a new component
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId } = req.query;
    
    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Get the current user
    const user = await supabaseService.auth.getCurrentUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the project to check ownership
    const project = await supabaseService.database.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if the user owns the project
    if (project.user_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
      const components = await supabaseService.database.getProjectComponents(projectId);
      return res.status(200).json({ components });
    } else if (req.method === 'POST') {
      const { name, type, code, filePath } = req.body;
      
      if (!name || !type || !code || !filePath) {
        return res.status(400).json({ 
          error: 'Component name, type, code, and file path are required' 
        });
      }
      
      const component = await supabaseService.database.createComponent(
        projectId,
        name,
        type,
        code,
        filePath
      );
      
      if (!component) {
        return res.status(500).json({ error: 'Failed to create component' });
      }
      
      return res.status(201).json({ component });
    }
  } catch (error) {
    console.error('Error in components API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
}
