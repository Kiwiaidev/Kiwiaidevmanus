import { NextApiRequest, NextApiResponse } from 'next';
import AIService from '../../../services/ai/AIService';
import { ProjectRequirements } from '../../../services/ai/types';

const aiService = new AIService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requirements: ProjectRequirements = req.body;

    if (!requirements.projectDescription) {
      return res.status(400).json({ error: 'Project description is required' });
    }

    const analysis = await aiService.analyzeRequirements(requirements);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error in analyze API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during project analysis' });
  }
}
