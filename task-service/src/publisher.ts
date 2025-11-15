import * as amqp from "amqplib";

const QUEUE = "notifications";

export async function sendNotification(rabbitUrl: string, message: string) {
  const conn = await amqp.connect(rabbitUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });
  console.log(`[Publisher] Sent: ${message}`);

  await channel.close();

  await conn.close();
}
