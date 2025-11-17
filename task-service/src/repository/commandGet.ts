import type { Task } from "../types";
import { getAllTasks } from "./db";

export function commandGET(message: Task) {
  const data = getAllTasks();
  if ("id" in message) {
    return data.find((task) => task.id === message.id);
  }
  return data;
}
