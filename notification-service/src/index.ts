import { startConsumer } from "./consumer";

const rabbitUrl =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

startConsumer(rabbitUrl).catch((err) => {
  console.error("Error in notification service:", err);
  process.exit(1);
});
