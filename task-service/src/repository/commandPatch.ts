import type { Task } from "../types";
import { updateTask } from "./db";

export function commandPATCH(message: Task) {
  return updateTask(message);
}
