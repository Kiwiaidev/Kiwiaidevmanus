import { NextApiRequest, NextApiResponse } from 'next';
import aiDebuggingService from '../../../services/debugging/AIDebuggingService';
import { SecurityAuditRequest } from '../../../services/debugging/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, context, sensitiveOperations } = req.body as SecurityAuditRequest;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const auditResult = await aiDebuggingService.auditSecurity({
      code,
      language,
      context,
      sensitiveOperations
    });

    return res.status(200).json(auditResult);
  } catch (error) {
    console.error('Error in security audit API:', error);
    return res.status(500).json({ 
      error: 'Failed to audit security',
      message: error.message || 'Unknown error'
    });
  }
}
