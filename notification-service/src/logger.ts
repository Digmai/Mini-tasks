import fs from "fs";
import path from "path";

const logPath = path.resolve("./logs/notifications.log");

export function logNotification(message: string) {
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
  } catch (err) {
    console.error("Ошибка записи в лог:", err);
  }
}
