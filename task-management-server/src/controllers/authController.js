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
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        const userExists = yield User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = yield User_1.User.create({ email, password });
        res.status(201).json({
            token: generateToken(user._id.toString()),
            user: {
                id: user._id.toString(),
                email: user.email,
                role: (_a = user.role) !== null && _a !== void 0 ? _a : 'user'
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.json({
            token: generateToken(user._id.toString()),
            user: {
                id: user._id.toString(),
                email: user.email,
                role: (_a = user.role) !== null && _a !== void 0 ? _a : 'user'
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
