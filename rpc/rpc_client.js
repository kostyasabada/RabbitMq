// docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management  to run rabbitMq container

const amqplib = require('amqplib');
const { v4: uuidvv4 } = require('uuid');

const arg = process.argv.slice(2);

if (arg.length == 0) {
  console.log('Usage: prc_client.js num');
  process.exit(1);
}

const num = parseInt(arg[0]);
const uuid = uuidvv4();

const getFib = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const q = await channel.assertQueue('', { exclusive: true });
  console.log('Requesting fib', num);

  await channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
    replyTo: q.queue,
    correlationId: uuid,
  });

  channel.consume(q.queue, (msg) => {
    if (msg.properties.correlationId === uuid) {
      console.log('MSG::::', msg.content.toString());
      setTimeout(() => {
        connection.close();
        process.exit(0);
      }, 500);
    }
  }), {noAck: true};
};

getFib();
