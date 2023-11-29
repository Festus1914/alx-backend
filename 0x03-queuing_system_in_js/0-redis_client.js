import redis from 'redis';

const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// To simulate an intentional disconnection for testing purposes
// Uncomment the following line
// client.quit();

process.on('SIGINT', () => {
  client.quit();
  process.exit();
});
