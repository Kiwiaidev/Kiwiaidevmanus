import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { AccessibilityCheckRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, context } = req.body as AccessibilityCheckRequest;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const accessibilityResult = await aiDebuggingService.checkAccessibility({
      code,
      language,
      context
    });

    return res.status(200).json(accessibilityResult);
  } catch (error) {
    console.error('Error in accessibility check API:', error);
    return res.status(500).json({ 
      error: 'Failed to check accessibility',
      message: error.message || 'Unknown error'
    });
  }
}
