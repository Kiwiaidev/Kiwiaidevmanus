import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for logout
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const success = await supabaseService.auth.signOut();

    if (!success) {
      return res.status(500).json({ error: 'Failed to sign out' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in logout API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during logout' });
  }
}
