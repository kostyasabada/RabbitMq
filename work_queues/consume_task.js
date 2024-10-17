const amqplib = require('amqplib');

const queueName = 'task';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  (await channel).assertQueue(queueName, { durable: true });
  //consumer can't receive new message before complete one. if put more - how many messages can receive consumer simultaneously
  channel.prefetch(1);
  console.log(`waiting for messages in queue ${queueName}`);
  channel.consume(
    queueName,
    (msg) => {
      const seconds = msg.content.toString().split('.').length - 1;
      console.log('[X] Received:', msg.content.toString());
      setTimeout(() => {
        console.log('Done resizing image');
        // this instead of { noAck: true } to inform manually
        channel.ack(msg);
      }, seconds * 1000);
    },
    //if true, delete message from queue automatically. better do manually. Upper code
    { noAck: false }
  );
};

sendMsg();
