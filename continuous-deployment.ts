import { NextApiRequest, NextApiResponse } from 'next';
import netlifyDeploymentService from '../../../services/netlify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for continuous deployment setup
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { siteId, githubRepo, buildCommand, buildDir, token } = req.body;

    if (!siteId || !githubRepo || !githubRepo.owner || !githubRepo.repo) {
      return res.status(400).json({ error: 'Site ID and GitHub repository details are required' });
    }

    if (token) {
      netlifyDeploymentService.setToken(token);
    } else if (!process.env.NETLIFY_TOKEN) {
      return res.status(401).json({ error: 'Netlify token is required' });
    }

    const success = await netlifyDeploymentService.setupContinuousDeployment(
      siteId,
      githubRepo,
      buildCommand,
      buildDir
    );

    if (!success) {
      return res.status(500).json({ error: 'Failed to setup continuous deployment' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in continuous deployment API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during continuous deployment setup' });
  }
}
