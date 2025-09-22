let producer;
let consumer;

async function connectKafka() {
  const { Kafka } = await import("kafkajs");
  const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
  });

  producer = kafka.producer();
  await producer.connect();

  consumer = kafka.consumer({ groupId: "order-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  console.log("Kafka producer & consumer 연결 완료");
}

function getProducer() {
  return producer;
}

function getConsumer() {
  return consumer;
}

module.exports = {
  connectKafka,
  getProducer,
  getConsumer,
};
