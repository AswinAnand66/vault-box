import { Request, Response } from 'express';
import VaultEntry from '../models/VaultEntry';

export const createEntry = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { title, category, content, autoDeleteDate, visibility, unlockAfter } = req.body;
    const user = req.user;

    // Create new entry
    const entry = new VaultEntry({
      title,
      category,
      content,
      autoDeleteDate,
      visibility,
      unlockAfter,
      owner: user._id
    });

    // Encrypt content with user's password
    entry.encryptContent(req.body.encryptionPassword);

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create entry' });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = req.user;
    const entries = await VaultEntry.find({ owner: user._id });
    res.json(entries);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get entries' });
  }
};

export const getEntry = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const user = req.user;
    const { encryptionPassword } = req.body;

    const entry = await VaultEntry.findOne({ _id: id, owner: user._id });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Decrypt content
    const decryptedContent = entry.decryptContent(encryptionPassword);
    res.json({ ...entry.toObject(), content: decryptedContent });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get entry' });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const user = req.user;
    const { title, category, content, autoDeleteDate, visibility, unlockAfter, encryptionPassword } = req.body;

    const entry = await VaultEntry.findOne({ _id: id, owner: user._id });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Update fields
    entry.title = title || entry.title;
    entry.category = category || entry.category;
    entry.autoDeleteDate = autoDeleteDate || entry.autoDeleteDate;
    entry.visibility = visibility || entry.visibility;
    entry.unlockAfter = unlockAfter || entry.unlockAfter;

    if (content) {
      entry.content = content;
      entry.encryptContent(encryptionPassword);
    }

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update entry' });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = req.params;
    const user = req.user;

    const entry = await VaultEntry.findOneAndDelete({ _id: id, owner: user._id });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete entry' });
  }
};

export const getEmergencyEntries = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = req.user;
    const { encryptionPassword } = req.body;

    // Get entries that are either shared or have unlock date passed
    const entries = await VaultEntry.find({
      owner: user._id,
      $or: [
        { visibility: 'Shared' },
        { 
          visibility: 'UnlockAfter',
          unlockAfter: { $lte: new Date() }
        }
      ]
    });

    // Decrypt entries
    const decryptedEntries = entries.map(entry => {
      const decryptedContent = entry.decryptContent(encryptionPassword);
      return { ...entry.toObject(), content: decryptedContent };
    });

    res.json(decryptedEntries);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get emergency entries' });
  }
}; 