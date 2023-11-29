import kue from 'kue';

// Create an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a Kue queue with concurrency set to 2
const queue = kue.createQueue({ concurrency: 2 });

// Create a function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  // Track the progress of the job
  job.progress(0, 100);

  // Check if phoneNumber is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job with an error if blacklisted
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Update the progress to 50%
  job.progress(50, 100);

  // Log the notification
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Complete the job
  done();
}

// Process jobs on the 'push_notification_code_2' queue
queue.process('push_notification_code_2', 2, (job, done) => {
  // Extract data from the job
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message, job, done);
});

// Listen for job completion
queue.on('job complete', (id) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    console.log(`Notification job #${job.id} completed`);
  });
});

// Listen for job failure
queue.on('job failed', (id, result) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    console.error(`Notification job #${job.id} failed: ${result}`);
  });
});

// Gracefully handle process termination
process.on('SIGINT', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});
