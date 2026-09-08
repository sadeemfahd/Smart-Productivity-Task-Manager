const AppError = require("../utils/appError");

const ALLOWED_PRIORITIES = ["low", "medium", "high"];
const ALLOWED_STATUSES = ["pending", "completed"];

function isValidDate(value) {
  return !Number.isNaN(new Date(value).getTime());
}

function normalizeDeadline(deadline) {
  if (deadline === undefined || deadline === null || deadline === "") {
    return null;
  }

  if (!isValidDate(deadline)) {
    throw new AppError(400, "Invalid deadline date");
  }

  return new Date(deadline).toISOString();
}

function validateCreatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new AppError(400, "Invalid request body");
  }

  const { title, description, priority, deadline } = payload;

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new AppError(400, "Title is required");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new AppError(400, "Description must be a string");
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    throw new AppError(400, "Priority must be one of: low, medium, high");
  }

  return {
    title: title.trim(),
    description: description ? description.trim() : "",
    status: "pending",
    priority: priority || "medium",
    deadline: normalizeDeadline(deadline)
  };
}

function validateUpdatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new AppError(400, "Invalid request body");
  }

  const allowedFields = ["title", "description", "status", "priority", "deadline"];
  const incomingFields = Object.keys(payload);

  if (incomingFields.length === 0) {
    throw new AppError(400, "At least one field must be provided for update");
  }

  const invalidFields = incomingFields.filter((field) => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    throw new AppError(400, `Invalid fields: ${invalidFields.join(", ")}`);
  }

  const updates = {};

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      throw new AppError(400, "Title must be a non-empty string");
    }
    updates.title = payload.title.trim();
  }

  if (payload.description !== undefined) {
    if (typeof payload.description !== "string") {
      throw new AppError(400, "Description must be a string");
    }
    updates.description = payload.description.trim();
  }

  if (payload.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(payload.status)) {
      throw new AppError(400, "Status must be one of: pending, completed");
    }
    updates.status = payload.status;
  }

  if (payload.priority !== undefined) {
    if (!ALLOWED_PRIORITIES.includes(payload.priority)) {
      throw new AppError(400, "Priority must be one of: low, medium, high");
    }
    updates.priority = payload.priority;
  }

  if (payload.deadline !== undefined) {
    updates.deadline = normalizeDeadline(payload.deadline);
  }

  return updates;
}

module.exports = {
  validateCreatePayload,
  validateUpdatePayload
};
