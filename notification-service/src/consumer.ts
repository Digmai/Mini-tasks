import * as amqp from "amqplib";
import { logNotification } from "./logger";

const QUEUE = "notifications";

export async function startConsumer(rabbitUrl: string) {
  const conn = await amqp.connect(rabbitUrl);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`[Consumer] Waiting for messages in queue "${QUEUE}"...`);

  interface NotificationMessage {
    content: Buffer;
    fields: amqp.MessageFields;
    properties: amqp.MessageProperties;
  }

  channel.consume(QUEUE, (msg: NotificationMessage | null) => {
    if (msg) {
      const content: string = msg.content.toString();
      console.log(`[Consumer] Received: ${content}`);
      logNotification(content);
      channel.ack(msg as amqp.Message);
    }
  });
}
