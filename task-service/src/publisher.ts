import * as amqp from "amqplib";
import { Repository } from "./repository/Repository";

export async function consumeMessages(rabbitUrl: string, queueName: string) {
  const conn = await amqp.connect(rabbitUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`🐇 Consumer connected to RabbitMQ, queue: ${queueName}`);

  channel.consume(queueName, (msg: amqp.Message | null) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());

    // отправляем ответ в очередь replyTo
    channel.sendToQueue(
      msg.properties.replyTo, // очередь для ответа
      Buffer.from(JSON.stringify(new Repository(content).resolve())),
      { correlationId: msg.properties.correlationId } // обязательно тот же correlationId
    );
    channel.ack(msg);
  });
}
