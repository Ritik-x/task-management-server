"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject =
  exports.updateProject =
  exports.createProject =
  exports.getProjects =
    void 0;
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const getProjects = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const projects = yield Project_1.Project.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });
      res.json({ projects });
    } catch (_a) {
      res.status(500).json({ message: "Server error" });
    }
  });
exports.getProjects = getProjects;
const createProject = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const project = yield Project_1.Project.create({
        name: req.body.name,
        userId: req.user._id,
      });
      res.status(201).json(project);
    } catch (_a) {
      res.status(500).json({ message: "Server error" });
    }
  });
exports.createProject = createProject;
const updateProject = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const project = yield Project_1.Project.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: { name: req.body.name } },
        { new: true, runValidators: true },
      );
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (_a) {
      res.status(500).json({ message: "Server error" });
    }
  });
exports.updateProject = updateProject;
const deleteProject = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const project = yield Project_1.Project.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      yield Task_1.Task.deleteMany({
        userId: req.user._id,
        projectId: req.params.id,
      });
      res.status(204).send();
    } catch (_a) {
      res.status(500).json({ message: "Server error" });
    }
  });
exports.deleteProject = deleteProject;
