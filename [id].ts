import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Get a specific project
  // PUT: Update a project
  // DELETE: Delete a project
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Get the current user
    const user = await supabaseService.auth.getCurrentUser();
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the project to check ownership
    const project = await supabaseService.database.getProject(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if the user owns the project
    if (project.user_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ project });
    } else if (req.method === 'PUT') {
      const { name, description, status, repository_url, deployment_url } = req.body;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (status) updates.status = status;
      if (repository_url !== undefined) updates.repository_url = repository_url;
      if (deployment_url !== undefined) updates.deployment_url = deployment_url;
      
      const updatedProject = await supabaseService.database.updateProject(id, updates);
      
      if (!updatedProject) {
        return res.status(500).json({ error: 'Failed to update project' });
      }
      
      return res.status(200).json({ project: updatedProject });
    } else if (req.method === 'DELETE') {
      const success = await supabaseService.database.deleteProject(id);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete project' });
      }
      
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error in project API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
}
