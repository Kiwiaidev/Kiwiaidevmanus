import { NextApiRequest, NextApiResponse } from 'next';
import githubAutomationService from '../../../services/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for committing files
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { owner, repo, files, token } = req.body;

    if (!owner || !repo || !files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Owner, repo, and files array are required' });
    }

    if (token) {
      githubAutomationService.setToken(token);
    } else if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const success = await githubAutomationService.commitProjectFiles(
      owner,
      repo,
      files
    );

    if (!success) {
      return res.status(500).json({ error: 'Failed to commit files' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in commit files API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during file commit' });
  }
}
