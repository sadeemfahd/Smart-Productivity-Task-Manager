const { Firestore } = require("@google-cloud/firestore");

const TASKS_COLLECTION = "tasks";

class AnalyticsService {
  constructor() {
    const options = {};
    if (process.env.GOOGLE_CLOUD_PROJECT) {
      options.projectId = process.env.GOOGLE_CLOUD_PROJECT;
    }

    this.firestore = new Firestore(options);
    this.collection = this.firestore.collection(TASKS_COLLECTION);
  }

  async getAllTasks() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  isOverdueTask(task, now = new Date()) {
    if (!task || !task.deadline || task.status === "completed") {
      return false;
    }

    const deadline = new Date(task.deadline);
    if (Number.isNaN(deadline.getTime())) {
      return false;
    }

    return deadline < now;
  }

  calculateCompletionRate(totalTasks, completedTasks) {
    if (totalTasks === 0) {
      return 0;
    }

    return Number(((completedTasks / totalTasks) * 100).toFixed(2));
  }

  async getSummary() {
    const tasks = await this.getAllTasks();
    const now = new Date();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = tasks.filter((task) => task.status !== "completed").length;
    const overdueTasks = tasks.filter((task) => this.isOverdueTask(task, now)).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: this.calculateCompletionRate(totalTasks, completedTasks)
    };
  }

  async getOverdueTasks() {
    const tasks = await this.getAllTasks();
    const now = new Date();
    return tasks.filter((task) => this.isOverdueTask(task, now));
  }

  async getPriorityStats() {
    const tasks = await this.getAllTasks();

    return tasks.reduce(
      (accumulator, task) => {
        const priority = task.priority;
        if (priority === "low" || priority === "medium" || priority === "high") {
          accumulator[priority] += 1;
        }
        return accumulator;
      },
      { low: 0, medium: 0, high: 0 }
    );
  }

  async getCompletionRate() {
    const tasks = await this.getAllTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;

    return {
      completionRate: this.calculateCompletionRate(totalTasks, completedTasks)
    };
  }
}

module.exports = AnalyticsService;
