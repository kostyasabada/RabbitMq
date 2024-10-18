const amqplib = require('amqplib');

const arg = process.argv.slice(2);

if (arg.length == 0) {
  console.log("Usage: receive_logs_direct.js info] [warning] [error]");
  process.exit(1);
  
}

const exchangeName = 'direct_logs';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'direct', { durable: false });

  // exclusive: true if connection is closed the queue will be deleted
  const queue = await channel.assertQueue('', { exclusive: true });
  console.log(`waiting for messages in queue ${queue.queue}`);
  channel.bindQueue(queue.queue, exchangeName, 'error');
  // can listen a lot of keys in one consumer
  // channel.bindQueue(queue.queue, exchangeName, 'info');
  // channel.bindQueue(queue.queue, exchangeName, 'warning');

  channel.consume(
    queue.queue,
    (msg) => {
      if (msg.content) {
        console.log('Routing key is: ', msg.fields.routingKey,'Message: ', msg.content.toString());
      }
      console.log('[X] Received:', msg.content.toString());
    },
    { noAck: true }
  );
};

sendMsg();
