import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// Admin-only: list all users
router.get('/users', protect, requireRole('admin'), adminController.listUsers);

export default router;

