import { Response } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { RequestHandler } from '../types/express';

export const getProjects: RequestHandler = async (req, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject: RequestHandler = async (req, res: Response) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      userId: req.user._id,
    });
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject: RequestHandler = async (req, res: Response) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { name: req.body.name } },
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject: RequestHandler = async (req, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    await Task.deleteMany({ userId: req.user._id, projectId: req.params.id });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
