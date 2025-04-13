import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../../services/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for user registration
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await supabaseService.auth.signUp(email, password, fullName);

    if (!user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    return res.status(201).json({ user });
  } catch (error) {
    console.error('Error in register API route:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during registration' });
  }
}
