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

// Create Hash using hset
client.hset(
  'HolbertonSchools',
  'Portland',
  '50',
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Seattle',
  '80',
  redis.print
);

client.hset(
  'HolbertonSchools',
  'New York',
  '20',
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Bogota',
  '20',
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Cali',
  '40',
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Paris',
  '2',
  redis.print
);

// Display Hash using hgetall
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) {
    console.error(`Error getting hash value: ${err}`);
    return;
  }
  console.log(reply);
});

process.on('SIGINT', () => {
  client.quit();
  process.exit();
});
