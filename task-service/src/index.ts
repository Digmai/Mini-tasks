import { consumeMessages } from "./publisher";

export const QUEUE_NAME = "task_queue";

consumeMessages(
  "amqp://guest:guest@rabbitmq:5672",
  QUEUE_NAME,
  (content, msg) => {
    console.log("Получено сообщение:", content);
    // Ваша логика обработки
  }
);
