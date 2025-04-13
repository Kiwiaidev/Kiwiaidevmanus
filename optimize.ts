import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { PerformanceOptimizationRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, performanceProfile, context } = req.body as PerformanceOptimizationRequest;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const optimizationResult = await aiDebuggingService.optimizePerformance({
      code,
      language,
      performanceProfile,
      context
    });

    return res.status(200).json(optimizationResult);
  } catch (error) {
    console.error('Error in performance optimization API:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize performance',
      message: error.message || 'Unknown error'
    });
  }
}
