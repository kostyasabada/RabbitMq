// docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management  to run rabbitMq container

const amqplib = require('amqplib');

const queueName = 'hello';

const msg = 'Hello World';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  (await channel).assertQueue(queueName,  { durable: false });
  (await channel).sendToQueue(queueName, Buffer.from(msg));
  console.log('sent:', msg);
  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
};

sendMsg();
