import * as amqp from "amqplib";
import { Repository } from "./repository/Repository";

const QUEUE_notifications = "notifications";

export async function consumeMessages(rabbitUrl: string, queueName: string) {
  const conn = await amqp.connect(rabbitUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`🐇 Consumer connected to RabbitMQ, queue: ${queueName}`);

  channel.consume(queueName, (msg: amqp.Message | null) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());

    const result = new Repository(content).resolve();

    channel.sendToQueue(
      msg.properties.replyTo, // очередь для ответа
      Buffer.from(JSON.stringify(result)),
      { correlationId: msg.properties.correlationId } // обязательно тот же correlationId
    );

    channel.sendToQueue(
      QUEUE_notifications, // очередь для уведомлений
      Buffer.from(JSON.stringify(result)),
      { persistent: true } // обязательно тот же correlationId
    );

    // отправляем ответ в очередь replyTo
    channel.sendToQueue(
      msg.properties.replyTo, // очередь для ответа
      Buffer.from(JSON.stringify(result)),
      { correlationId: msg.properties.correlationId } // обязательно тот же correlationId
    );
    channel.ack(msg);
  });
}
