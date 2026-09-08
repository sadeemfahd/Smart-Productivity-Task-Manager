const TaskRepository = require("./taskRepository");
const { validateCreatePayload, validateUpdatePayload } = require("../models/taskModel");
const AppError = require("../utils/appError");

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(payload) {
    const validatedData = validateCreatePayload(payload);
    return this.taskRepository.create(validatedData);
  }

  async getAllTasks() {
    return this.taskRepository.getAll();
  }

  async getTaskById(id) {
    const task = await this.taskRepository.getById(id);
    if (!task) {
      throw new AppError(404, "Task not found");
    }
    return task;
  }

  async updateTask(id, payload) {
    const updates = validateUpdatePayload(payload);
    const updatedTask = await this.taskRepository.updateById(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!updatedTask) {
      throw new AppError(404, "Task not found");
    }

    return updatedTask;
  }

  async deleteTask(id) {
    const deleted = await this.taskRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(404, "Task not found");
    }
  }

  async markTaskAsCompleted(id) {
    const now = new Date().toISOString();
    const updatedTask = await this.taskRepository.updateById(id, {
      status: "completed",
      completedAt: now,
      updatedAt: now
    });
    if (!updatedTask) {
      throw new AppError(404, "Task not found");
    }
    return updatedTask;
  }
}

module.exports = TaskService;
