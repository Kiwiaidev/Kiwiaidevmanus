import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { TestGenerationRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, testFramework, coverageGoal, context } = req.body as TestGenerationRequest;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const testResult = await aiDebuggingService.generateTests({
      code,
      language,
      testFramework,
      coverageGoal,
      context
    });

    return res.status(200).json(testResult);
  } catch (error) {
    console.error('Error in test generation API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate tests',
      message: error.message || 'Unknown error'
    });
  }
}
