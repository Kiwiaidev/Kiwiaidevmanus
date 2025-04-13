import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Get a specific component
  // PUT: Update a component
  // DELETE: Delete a component
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, componentId } = req.query;
    
    if (!projectId || typeof projectId !== 'string' || !componentId || typeof componentId !== 'string') {
      return res.status(400).json({ error: 'Project ID and Component ID are required' });
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

    // Get the component
    const components = await supabaseService.database.getProjectComponents(projectId);
    const component = components.find(c => c.id === componentId);
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ component });
    } else if (req.method === 'PUT') {
      const { name, code, filePath } = req.body;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (code) updates.code = code;
      if (filePath) updates.file_path = filePath;
      
      const updatedComponent = await supabaseService.database.updateComponent(componentId, updates);
      
      if (!updatedComponent) {
        return res.status(500).json({ error: 'Failed to update component' });
      }
      
      return res.status(200).json({ component: updatedComponent });
    } else if (req.method === 'DELETE') {
      // For simplicity, we'll assume there's a deleteComponent method
      // This would need to be added to the DatabaseService
      const success = await supabaseService.database.deleteComponent(componentId);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete component' });
      }
      
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error in component API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
}
