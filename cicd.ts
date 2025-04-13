import { NextApiRequest, NextApiResponse } from 'next';
import githubAutomationService from '../../../services/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for CI/CD setup
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { owner, repo, buildCommand, testCommand, deploymentTarget, token } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    if (token) {
      githubAutomationService.setToken(token);
    } else if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const workflowUrl = await githubAutomationService.setupCICD(
      owner,
      repo,
      buildCommand,
      testCommand,
      deploymentTarget
    );

    if (!workflowUrl) {
      return res.status(500).json({ error: 'Failed to setup CI/CD pipeline' });
    }

    return res.status(201).json({ workflowUrl });
  } catch (error) {
    console.error('Error in setup CI/CD API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during CI/CD setup' });
  }
}
