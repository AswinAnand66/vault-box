import mongoose from 'mongoose';
import crypto from 'crypto-js';

export interface IVaultEntry extends mongoose.Document {
  title: string;
  category: 'Finance' | 'Health' | 'Personal' | 'Notes';
  content: string;
  autoDeleteDate?: Date;
  visibility: 'Private' | 'Shared' | 'UnlockAfter';
  unlockAfter?: Date;
  owner: mongoose.Types.ObjectId;
  encryptContent(password: string): void;
  decryptContent(password: string): string;
}

const vaultEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Finance', 'Health', 'Personal', 'Notes']
  },
  content: {
    type: String,
    required: true
  },
  autoDeleteDate: {
    type: Date
  },
  visibility: {
    type: String,
    required: true,
    enum: ['Private', 'Shared', 'UnlockAfter'],
    default: 'Private'
  },
  unlockAfter: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Method to encrypt content
vaultEntrySchema.methods.encryptContent = function(password: string): void {
  this.content = crypto.AES.encrypt(this.content, password).toString();
};

// Method to decrypt content
vaultEntrySchema.methods.decryptContent = function(password: string): string {
  try {
    const bytes = crypto.AES.decrypt(this.content, password);
    return bytes.toString(crypto.enc.Utf8);
  } catch (error) {
    throw new Error('Invalid password');
  }
};

// Middleware to check and delete expired entries
vaultEntrySchema.pre('save', function(next) {
  if (this.autoDeleteDate && this.autoDeleteDate < new Date()) {
    this.deleteOne();
  }
  next();
});

export default mongoose.model<IVaultEntry>('VaultEntry', vaultEntrySchema); 