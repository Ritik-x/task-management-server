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
exports.requireRole = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get user
        const user = yield User_1.User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
});
exports.protect = protect;
const requireRole = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    });
};
exports.requireRole = requireRole;
