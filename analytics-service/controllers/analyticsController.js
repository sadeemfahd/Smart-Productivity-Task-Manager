const AnalyticsService = require("../services/analyticsService");

const analyticsService = new AnalyticsService();

async function getSummary(_req, res, next) {
  try {
    const summary = await analyticsService.getSummary();
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}

async function getOverdueTasks(_req, res, next) {
  try {
    const overdueTasks = await analyticsService.getOverdueTasks();
    res.status(200).json(overdueTasks);
  } catch (error) {
    next(error);
  }
}

async function getPriorityStats(_req, res, next) {
  try {
    const priorityStats = await analyticsService.getPriorityStats();
    res.status(200).json(priorityStats);
  } catch (error) {
    next(error);
  }
}

async function getCompletionRate(_req, res, next) {
  try {
    const completionRate = await analyticsService.getCompletionRate();
    res.status(200).json(completionRate);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
  getOverdueTasks,
  getPriorityStats,
  getCompletionRate
};
