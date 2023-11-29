const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');

const app = express();
const port = 1245;

// Connect to Redis
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Connect to Kue
const queue = kue.createQueue();

// Initialize available seats
const initialAvailableSeats = 50;
let reservationEnabled = true;

// Function to reserve seat in Redis
const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

// Function to get current available seats from Redis
const getCurrentAvailableSeats = async () => {
  const availableSeats = await getAsync('available_seats');
  return availableSeats ? parseInt(availableSeats) : 0;
};

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
  } else {
    const job = queue.create('reserve_seat').save((err) => {
      if (!err) {
        res.json({ status: 'Reservation in process' });
      } else {
        res.json({ status: 'Reservation failed' });
      }
    });
  }
});

// Route to process the queue and decrease available seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    
    if (currentAvailableSeats > 0) {
      await reserveSeat(currentAvailableSeats - 1);

      if (currentAvailableSeats - 1 === 0) {
        reservationEnabled = false;
      }

      done();
      console.log(`Seat reservation job ${job.id} completed`);
    } else {
      done(new Error('Not enough seats available'));
      console.log(`Seat reservation job ${job.id} failed: Not enough seats available`);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
