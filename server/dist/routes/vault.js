"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vaultController_1 = require("../controllers/vaultController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes
router.post('/', auth_1.auth, vaultController_1.createEntry);
router.get('/', auth_1.auth, vaultController_1.getEntries);
router.get('/:id', auth_1.auth, vaultController_1.getEntry);
router.put('/:id', auth_1.auth, vaultController_1.updateEntry);
router.delete('/:id', auth_1.auth, vaultController_1.deleteEntry);
// Emergency access routes
router.get('/emergency/entries', auth_1.auth, auth_1.checkTrustedContact, vaultController_1.getEmergencyEntries);
exports.default = router;
