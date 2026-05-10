import { User } from '../models/User';
import { RequestHandler } from '../types/express';

export const listUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

