import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
};

export const updateTrustedContact = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = req.user as IUser;
    const { email, unlockDelay } = req.body;

    user.trustedContact = {
      email,
      unlockDelay: parseInt(unlockDelay),
      lastAccessAttempt: null
    };

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update trusted contact' });
  }
};

export const requestEmergencyAccess = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = req.user as IUser;
    const { email } = req.body;

    if (!user.trustedContact || user.trustedContact.email !== email) {
      return res.status(403).json({ error: 'Not a trusted contact' });
    }

    const inactiveDays = Math.floor(
      (new Date().getTime() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (!user.trustedContact || inactiveDays < user.trustedContact.unlockDelay) {
      return res.status(403).json({ 
        error: `User must be inactive for ${user.trustedContact?.unlockDelay} days before emergency access is granted` 
      });
    }

    // Generate temporary access token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Failed to request emergency access' });
  }
}; 