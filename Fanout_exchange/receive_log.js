const amqplib = require('amqplib');

const exchangeName = 'logs';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'fanout', { durable: false });

  // exclusive: true if connection is closed the queue will be deleted
  const queue = await channel.assertQueue('', { exclusive: true });
  console.log(`waiting for messages in queue ${queue.queue}`);
  channel.bindQueue(queue.queue, exchangeName, '');
  channel.consume(
    queue.queue,
    (msg) => {
      if (msg.content) {
        console.log('the message is: ', msg.content.toString());
      }
      console.log('[X] Received:', msg.content.toString());
    },
    { noAck: true }
  );
};

sendMsg();
