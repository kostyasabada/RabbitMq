const amqplib = require('amqplib');

const queueName = 'rpc_queue';

function fibonacci(n) {
  if(n == 0 || n == 1) {
    return n;
  } else {
    return fibonacci(n -1) + fibonacci(n -2);
  }
}

const processTask = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  (await channel).assertQueue(queueName, { durable: false });
  channel.prefetch(1);
  console.log(`waiting for RPC request`);
  channel.consume(
    queueName,
    (msg) => {
      const n = parseInt(msg.content.toString());
      console.log('Requesting fib', n);

      const figNum = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(figNum.toString()), {
        correlationId: msg.properties.correlationId
      });
      channel.ack(msg)
    },


    { noAck: false }
  );
};

processTask();
