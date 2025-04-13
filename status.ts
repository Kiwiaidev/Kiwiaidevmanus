import { NextApiRequest, NextApiResponse } from 'next';
import githubAutomationService from '../../../services/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for workflow status
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { owner, repo, workflowId, token } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    if (token && typeof token === 'string') {
      githubAutomationService.setToken(token);
    } else if (!process.env.GITHUB_TOKEN) {
      return res.status(401).json({ error: 'GitHub token is required' });
    }

    const status = await githubAutomationService.getWorkflowStatus(
      owner as string,
      repo as string,
      workflowId as string || 'ci-cd.yml'
    );

    if (!status) {
      return res.status(404).json({ error: 'No workflow runs found' });
    }

    return res.status(200).json(status);
  } catch (error) {
    console.error('Error in workflow status API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred while fetching workflow status' });
  }
}
