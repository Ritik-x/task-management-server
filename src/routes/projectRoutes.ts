import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validateMiddleware";
import * as projectController from "../controllers/projectController";

const router = express.Router();

const projectValidation = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
];

router.get("/", projectController.getProjects);
router.post("/", validate(projectValidation), projectController.createProject);
router.patch(
  "/:id",
  validate(projectValidation),
  projectController.updateProject,
);
router.delete("/:id", projectController.deleteProject);

export default router;
