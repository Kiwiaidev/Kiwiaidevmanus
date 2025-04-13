import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { ErrorFixRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, error, stackTrace, context } = req.body as ErrorFixRequest;

    if (!code || !language || !error) {
      return res.status(400).json({ error: 'Code, language, and error message are required' });
    }

    const fixResult = await aiDebuggingService.fixError({
      code,
      language,
      error,
      stackTrace,
      context
    });

    return res.status(200).json(fixResult);
  } catch (error) {
    console.error('Error in error fix API:', error);
    return res.status(500).json({ 
      error: 'Failed to fix error',
      message: error.message || 'Unknown error'
    });
  }
}
