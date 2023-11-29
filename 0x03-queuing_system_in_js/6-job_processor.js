import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define the sendNotification function
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs on the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  // Extract data from the job
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message);

  // Indicate that the job has been completed
  done();
});

// Gracefully handle process termination
process.on('SIGINT', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});
