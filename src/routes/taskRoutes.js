"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const taskController = __importStar(require("../controllers/taskController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const taskValidation = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('projectId').optional().isMongoId().withMessage('Invalid projectId'),
    (0, express_validator_1.body)('startTime').isISO8601().withMessage('Valid start time is required'),
    (0, express_validator_1.body)('endTime')
        .isISO8601()
        .withMessage('Valid end time is required')
        .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startTime)) {
            throw new Error('End time must be after start time');
        }
        return true;
    }),
    (0, express_validator_1.body)('priority')
        .isInt({ min: 1, max: 5 })
        .withMessage('Priority must be between 1 and 5')
];
const updateTaskValidation = [
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('projectId').optional().isMongoId().withMessage('Invalid projectId'),
    (0, express_validator_1.body)('startTime').optional().isISO8601().withMessage('Valid start time is required'),
    (0, express_validator_1.body)('endTime')
        .optional()
        .isISO8601()
        .withMessage('Valid end time is required')
        .custom((value, { req }) => {
        if (req.body.startTime && new Date(value) <= new Date(req.body.startTime)) {
            throw new Error('End time must be after start time');
        }
        return true;
    }),
    (0, express_validator_1.body)('priority')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Priority must be between 1 and 5'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['pending', 'finished'])
        .withMessage('Status must be either pending or finished')
];
router.get('/', taskController.getTasks);
router.post('/', (0, validateMiddleware_1.validate)(taskValidation), taskController.createTask);
router.patch('/:id', (0, validateMiddleware_1.validate)(updateTaskValidation), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/stats', authMiddleware_1.protect, taskController.getTaskStats);
exports.default = router;
