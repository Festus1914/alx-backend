import redis from 'redis';

const publisherClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

publisherClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

publisherClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisherClient.publish('holberton school channel', message);
  }, time);
}

// Call the publishMessage function
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);

process.on('SIGINT', () => {
  publisherClient.quit();
  process.exit();
});
