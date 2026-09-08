const crypto = require("crypto");
const { Firestore } = require("@google-cloud/firestore");

const TASKS_COLLECTION = "tasks";

class TaskRepository {
  constructor() {
    const options = {};
    if (process.env.GOOGLE_CLOUD_PROJECT) {
      options.projectId = process.env.GOOGLE_CLOUD_PROJECT;
    }

    this.firestore = new Firestore(options);
    this.collection = this.firestore.collection(TASKS_COLLECTION);
  }

  async create(taskData) {
    const newTask = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...taskData
    };

    await this.collection.doc(newTask.id).set(newTask);
    return newTask;
  }

  async getAll() {
    const snapshot = await this.collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => doc.data());
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }
  async updateById(id, updates) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
  
    if (!doc.exists) {
      return null;
    }
  
    const updatedTask = {
      ...doc.data(),
      ...updates,
      updatedAt: new Date().toISOString()
    };
  
    if (updates.status === "completed") {
      updatedTask.completedAt = new Date().toISOString();
    }
  
    await docRef.set(updatedTask);
    return updatedTask;
  }

  async deleteById(id) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return false;
    }

    await docRef.delete();
    return true;
  }
}

module.exports = TaskRepository;
