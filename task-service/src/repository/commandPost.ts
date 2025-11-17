import { createTask } from "./db";

export function commandPOST(message: any) {
  return createTask(message);
}
