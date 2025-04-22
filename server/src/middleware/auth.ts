import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const checkTrustedContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const trustedContact = user.trustedContact;

    if (!trustedContact || !trustedContact.email) {
      return res.status(403).json({ error: 'No trusted contact set up' });
    }

    // Check if user has been inactive for the specified delay
    const inactiveDays = Math.floor(
      (new Date().getTime() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (inactiveDays < trustedContact.unlockDelay) {
      return res.status(403).json({ 
        error: `User must be inactive for ${trustedContact.unlockDelay} days before emergency access is granted` 
      });
    }

    // Update last access attempt
    user.trustedContact.lastAccessAttempt = new Date();
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 