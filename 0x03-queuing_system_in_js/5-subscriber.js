import redis from 'redis';

const subscriberClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

subscriberClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

subscriberClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// Subscribe to the channel
subscriberClient.subscribe('holberton school channel');

// Listen for messages on the channel
subscriberClient.on('message', (channel, message) => {
  console.log(`Received message on channel ${channel}: ${message}`);

  // Unsubscribe and quit if the message is 'KILL_SERVER'
  if (message === 'KILL_SERVER') {
    subscriberClient.unsubscribe();
    subscriberClient.quit();
  }
});

process.on('SIGINT', () => {
  subscriberClient.unsubscribe();
  subscriberClient.quit();
  process.exit();
});
