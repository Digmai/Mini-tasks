import { deleteTask } from "./db";

export function commandDELETE(message: { id: string }) {
  return deleteTask(message.id);
}
