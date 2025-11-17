import type { Task } from "../types";

const Database: Map<string, Task> = new Map();
Database.set("1", { id: "1", title: "First Task", completed: false });
Database.set("2", { id: "2", title: "Second Task", completed: true });

export function getAllTasks() {
  return Array.from(Database.values());
}
export function createTask(task: { title: string; completed: boolean }) {
  const id = (Database.size + 1).toString();
  Database.set(id, { id, ...task });
  return Database.get(id);
}
export function updateTask(task: Task) {
  Database.set(task.id, task);
  return Database.get(task.id);
}
export function deleteTask(id: string) {
  return Database.delete(id);
}
export { Database };
