import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for login
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await supabaseService.auth.signIn(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error in login API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during login' });
  }
}
