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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { userId: req.user._id };
        if (req.query.priority)
            filter.priority = req.query.priority;
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.projectId)
            filter.projectId = req.query.projectId;
        const sort = {};
        if (req.query.field && req.query.order) {
            sort[req.query.field] = req.query.order === 'desc' ? -1 : 1;
        }
        const [tasks, total] = yield Promise.all([
            Task_1.Task.find(filter).sort(sort).skip(skip).limit(limit),
            Task_1.Task.countDocuments(filter)
        ]);
        res.json({
            tasks,
            total,
            page,
            limit
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getTasks = getTasks;
const validateTaskTimes = (startTime, endTime) => {
    if (startTime >= endTime) {
        throw new Error('End time must be after start time');
    }
};
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        validateTaskTimes(new Date(req.body.startTime), new Date(req.body.endTime));
        const task = yield Task_1.Task.create(Object.assign(Object.assign({}, req.body), { userId: req.user._id }));
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.startTime && req.body.endTime) {
            validateTaskTimes(new Date(req.body.startTime), new Date(req.body.endTime));
        }
        // If marking as finished, set endTime to now
        if (req.body.status === 'finished') {
            req.body.endTime = new Date().toISOString();
        }
        // Create update object with only provided fields
        const updateFields = {};
        if (req.body.title !== undefined)
            updateFields.title = req.body.title;
        if (req.body.projectId !== undefined)
            updateFields.projectId = req.body.projectId || null;
        if (req.body.priority !== undefined)
            updateFields.priority = req.body.priority;
        if (req.body.status !== undefined)
            updateFields.status = req.body.status;
        if (req.body.startTime !== undefined)
            updateFields.startTime = new Date(req.body.startTime);
        if (req.body.endTime !== undefined)
            updateFields.endTime = new Date(req.body.endTime);
        // Validate that at least one field is being updated
        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ message: 'No fields to update' });
            return;
        }
        const task = yield Task_1.Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { $set: updateFields }, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteTask = deleteTask;
const getTaskStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Get basic task counts
        const totalTasks = yield Task_1.Task.countDocuments({ userId });
        const completedTasks = yield Task_1.Task.countDocuments({ userId, status: 'finished' });
        const pendingTasks = yield Task_1.Task.countDocuments({ userId, status: 'pending' });
        // Calculate percentages
        const completedPercentage = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;
        const pendingPercentage = totalTasks > 0
            ? Math.round((pendingTasks / totalTasks) * 100)
            : 0;
        // Calculate average time for completed tasks
        const completedTasksStats = yield Task_1.Task.aggregate([
            {
                $match: {
                    userId: userId,
                    status: 'finished'
                }
            },
            {
                $project: {
                    completionTime: {
                        $divide: [
                            { $subtract: ['$endTime', '$startTime'] },
                            3600000 // Convert to hours
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalTime: { $sum: '$completionTime' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const averageTime = completedTasksStats.length > 0
            ? Math.round((completedTasksStats[0].totalTime / completedTasksStats[0].count) * 10) / 10
            : 0;
        // Get pending tasks analysis with time calculations
        const pendingTasksByPriority = yield Task_1.Task.aggregate([
            {
                $match: {
                    userId: userId,
                    status: 'pending'
                }
            },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                    timeElapsed: {
                        $sum: {
                            $cond: [
                                {
                                    $gt: [
                                        { $subtract: ['$$NOW', '$startTime'] },
                                        0
                                    ]
                                },
                                {
                                    $divide: [
                                        { $subtract: ['$$NOW', '$startTime'] },
                                        3600000
                                    ]
                                },
                                0
                            ]
                        }
                    },
                    estimatedTimeLeft: {
                        $sum: {
                            $cond: [
                                { $gt: ['$endTime', '$$NOW'] },
                                {
                                    $divide: [
                                        { $subtract: ['$endTime', '$$NOW'] },
                                        3600000
                                    ]
                                },
                                {
                                    $divide: [
                                        { $subtract: ['$endTime', '$startTime'] },
                                        3600000
                                    ]
                                }
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    priority: '$_id',
                    count: 1,
                    timeElapsed: { $round: ['$timeElapsed', 1] },
                    estimatedTimeLeft: { $round: ['$estimatedTimeLeft', 1] },
                    _id: 0
                }
            },
            { $sort: { priority: -1 } }
        ]);
        // Calculate total time metrics
        const totalTimeMetrics = pendingTasksByPriority.reduce((acc, curr) => ({
            totalTimeElapsed: acc.totalTimeElapsed + (curr.timeElapsed || 0),
            totalTimeToFinish: acc.totalTimeToFinish + (curr.estimatedTimeLeft || 0)
        }), { totalTimeElapsed: 0, totalTimeToFinish: 0 });
        res.json({
            overview: {
                totalTasks,
                completedTasks,
                pendingTasks,
                completedPercentage,
                pendingPercentage,
                averageTime,
            },
            timeMetrics: {
                averageCompletionTime: averageTime,
                totalTimeElapsed: Math.round(totalTimeMetrics.totalTimeElapsed * 10) / 10,
                totalTimeToFinish: Math.round(totalTimeMetrics.totalTimeToFinish * 10) / 10,
                pendingTasksByPriority
            }
        });
    }
    catch (error) {
        console.error('Error getting task stats:', error);
        res.status(500).json({ message: 'Error fetching task statistics' });
    }
});
exports.getTaskStats = getTaskStats;
