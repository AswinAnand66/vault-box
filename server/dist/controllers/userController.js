"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestEmergencyAccess = exports.updateTrustedContact = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Create new user
        const user = new User_1.default({ email, password });
        yield user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
});
exports.login = login;
const updateTrustedContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = req.user;
        const { email, unlockDelay } = req.body;
        user.trustedContact = {
            email,
            unlockDelay: parseInt(unlockDelay),
            lastAccessAttempt: null
        };
        yield user.save();
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update trusted contact' });
    }
});
exports.updateTrustedContact = updateTrustedContact;
const requestEmergencyAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = req.user;
        const { email } = req.body;
        if (!user.trustedContact || user.trustedContact.email !== email) {
            return res.status(403).json({ error: 'Not a trusted contact' });
        }
        const inactiveDays = Math.floor((new Date().getTime() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (!user.trustedContact || inactiveDays < user.trustedContact.unlockDelay) {
            return res.status(403).json({
                error: `User must be inactive for ${(_a = user.trustedContact) === null || _a === void 0 ? void 0 : _a.unlockDelay} days before emergency access is granted`
            });
        }
        // Generate temporary access token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to request emergency access' });
    }
});
exports.requestEmergencyAccess = requestEmergencyAccess;
