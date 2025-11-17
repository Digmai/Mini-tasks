import * as amqp from "amqplib";

export async function consumeMessages(
  rabbitUrl: string,
  queueName: string,
  onMessage: (content: string, msg: amqp.Message) => void
) {
  const conn = await amqp.connect(rabbitUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  console.log(`🐇 Consumer connected to RabbitMQ, queue: ${queueName}`);

  channel.consume(queueName, (msg: amqp.Message | null) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    console.log("Получено сообщение:", content);

    // проверяем, что это GET
    if (content.action === "GET") {
      const tasks = [{ id: 1, name: "Test task" }]; // например, данные

      // отправляем ответ в очередь replyTo
      channel.sendToQueue(
        msg.properties.replyTo, // очередь для ответа
        Buffer.from(JSON.stringify(tasks)),
        { correlationId: msg.properties.correlationId } // обязательно тот же correlationId
      );
    }
  });
}
