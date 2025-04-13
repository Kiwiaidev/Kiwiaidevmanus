import { NextApiRequest, NextApiResponse } from 'next';
import githubAutomationService from '../../../services/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for creating feature branches and PRs
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { owner, repo, featureName, description, token } = req.body;

    if (!owner || !repo || !featureName) {
      return res.status(400).json({ error: 'Owner, repo, and feature name are required' });
    }

    if (token) {
      githubAutomationService.setToken(token);
    } else if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const pullRequestUrl = await githubAutomationService.createFeatureBranchAndPR(
      owner,
      repo,
      featureName,
      description
    );

    if (!pullRequestUrl) {
      return res.status(500).json({ error: 'Failed to create feature branch and pull request' });
    }

    return res.status(201).json({ pullRequestUrl });
  } catch (error) {
    console.error('Error in feature branch API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during feature branch creation' });
  }
}
