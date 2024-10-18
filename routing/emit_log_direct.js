const amqplib = require('amqplib');

const exchangeName = 'direct_logs';

const arg = process.argv.slice(2);
const msg = arg[1] || 'Hiiiiii';
const logType = arg[0];

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  (await channel).assertExchange(exchangeName, 'direct', { durable: false });
  (await channel).publish(exchangeName, logType, Buffer.from(msg));
  console.log('sent:', msg);
  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
};

sendMsg();
