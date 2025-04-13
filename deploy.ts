import { NextApiRequest, NextApiResponse } from 'next';
import netlifyDeploymentService from '../../../services/netlify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for deployment
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { siteId, localDir, message, production, token } = req.body;

    if (!siteId || !localDir) {
      return res.status(400).json({ error: 'Site ID and local directory are required' });
    }

    if (token) {
      netlifyDeploymentService.setToken(token);
    } else if (!process.env.NETLIFY_TOKEN) {
      return res.status(401).json({ error: 'Netlify token is required' });
    }

    let deployUrl;
    if (production) {
      deployUrl = await netlifyDeploymentService.deployToProduction(
        siteId,
        localDir,
        message || 'Production deployment'
      );
    } else {
      deployUrl = await netlifyDeploymentService.deployLocalDirectory(
        siteId,
        localDir,
        message || 'Preview deployment'
      );
    }

    if (!deployUrl) {
      return res.status(500).json({ error: 'Failed to deploy to Netlify' });
    }

    return res.status(200).json({ deployUrl });
  } catch (error) {
    console.error('Error in deploy API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during deployment' });
  }
}
