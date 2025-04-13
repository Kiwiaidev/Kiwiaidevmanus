import { NextApiRequest, NextApiResponse } from 'next';
import githubAutomationService from '../../../services/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for repository setup
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectName, description, isPrivate, token } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    if (token) {
      githubAutomationService.setToken(token);
    } else if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const repoUrl = await githubAutomationService.setupRepository(
      projectName,
      description,
      isPrivate !== undefined ? isPrivate : true
    );

    if (!repoUrl) {
      return res.status(500).json({ error: 'Failed to create repository' });
    }

    return res.status(201).json({ repositoryUrl: repoUrl });
  } catch (error) {
    console.error('Error in setup repository API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during repository setup' });
  }
}
