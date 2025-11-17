import { connect, type Channel, type ChannelModel } from "amqplib";
import type { RpcMessageTasks, Task } from "./types";
import { randomUUID } from "crypto";

let connection: ChannelModel;
let channel: Channel;

export const QUEUE_NAME = "task_queue";

export async function connectRabbitMQ() {
  connection = await connect("amqp://guest:guest@rabbitmq:5672");
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log("🐇 API Gateway connected to RabbitMQ");
}

export async function sendRpcMessage(
  queue: string,
  message: RpcMessageTasks
): Promise<Task> {
  return new Promise((resolve) => {
    const correlationId = randomUUID();

    // Создаём временную очередь для ответа
    channel.assertQueue(QUEUE_NAME, { exclusive: false }).then((q) => {
      const replyQueue = q.queue;

      channel.consume(
        replyQueue,
        (msg) => {
          if (msg?.properties.correlationId === correlationId) {
            resolve(JSON.parse(msg.content.toString()));
          }
        },
        { noAck: true }
      );

      // Отправляем сообщение с указанием очереди для ответа
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        correlationId,
        replyTo: replyQueue,
        persistent: true,
      });
    });
  });
}
