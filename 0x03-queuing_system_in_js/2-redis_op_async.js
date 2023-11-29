import redis from 'redis';
import { promisify } from 'util';

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

// Promisify the get method of the client
const getAsync = promisify(client.get).bind(client);

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

async function displaySchoolValue(schoolName) {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (error) {
    console.error(`Error getting value for ${schoolName}: ${error}`);
  }
}

// Call the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

process.on('SIGINT', () => {
  client.quit();
  process.exit();
});
