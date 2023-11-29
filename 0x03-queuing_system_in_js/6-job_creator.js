import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Define the job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a notification message.',
};

// Create a job and enqueue it
const job = queue.create('push_notification_code', jobData).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.error(`Error creating notification job: ${err}`);
  }

  // To process the job, go to the next task!
  process.exit();
});

// Listen for job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Listen for job failure
job.on('failed', (err) => {
  console.error(`Notification job failed: ${err}`);
});

// Gracefully handle process termination
process.on('SIGINT', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});
