const amqplib = require('amqplib');

const exchangeName = 'logs';

const msg = process.argv.slice(2).join(' ') || 'Hiiiiii';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  (await channel).assertExchange(exchangeName, 'fanout', { durable: false });
  (await channel).publish(exchangeName, '', Buffer.from(msg));
  console.log('sent:', msg);
  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
};

sendMsg();
