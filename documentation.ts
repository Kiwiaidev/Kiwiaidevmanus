import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { DocumentationGenerationRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, style, context } = req.body as DocumentationGenerationRequest;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const documentationResult = await aiDebuggingService.generateDocumentation({
      code,
      language,
      style,
      context
    });

    return res.status(200).json(documentationResult);
  } catch (error) {
    console.error('Error in documentation generation API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate documentation',
      message: error.message || 'Unknown error'
    });
  }
}
