import { NextApiRequest, NextApiResponse } from 'next';
import AIService from '../../../services/ai/AIService';
import { DebuggingRequest } from '../../../services/ai/types';

const aiService = new AIService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: DebuggingRequest = req.body;

    if (!request.projectId || !request.code) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId and code are required' 
      });
    }

    const response = await aiService.debugCode(request);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in debug API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during code debugging' });
  }
}
