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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
// Load environment variables
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.log(process.env.MONGODB_URI);
        console.error(`Error: ${envVar} is not defined in environment variables`);
        process.exit(1);
    }
}
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// Add allowed origins array
const allowedOrigins = [
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null, // Local development
    process.env.FRONTEND_URL, // Production frontend
    process.env.BACKEND_URL // Backend URL
].filter(Boolean); // Remove null/undefined values
// Debug log origins
console.log('Environment:', process.env.NODE_ENV);
console.log('Allowed Origins:', allowedOrigins);
// Middleware
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Access-Control-Allow-Origin']
}));
// Enable pre-flight requests for all routes
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
// Add a test route to verify CORS
app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS is working' });
});
// Database connection with retry logic
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
});
connectDB();
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tasks', authMiddleware_1.protect, taskRoutes_1.default);
app.use('/api/projects', authMiddleware_1.protect, projectRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Error handling
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
};
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
