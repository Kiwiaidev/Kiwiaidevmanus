import { NextApiRequest, NextApiResponse } from 'next';
import netlifyDeploymentService from '../../../services/netlify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for site creation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectName, buildCommand, buildDir, githubRepo, token } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    if (token) {
      netlifyDeploymentService.setToken(token);
    } else if (!process.env.NETLIFY_TOKEN) {
      return res.status(401).json({ error: 'Netlify token is required' });
    }

    const site = await netlifyDeploymentService.createSiteForProject(
      projectName,
      buildCommand,
      buildDir,
      githubRepo
    );

    if (!site) {
      return res.status(500).json({ error: 'Failed to create Netlify site' });
    }

    return res.status(201).json({ site });
  } catch (error) {
    console.error('Error in create site API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during site creation' });
  }
}
