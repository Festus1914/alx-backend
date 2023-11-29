import kue from 'kue';

// Create an array of jobs
const jobs = [
  { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
  { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153538781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153118782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4159518782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4158718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153818782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4154318781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account' },
];

// Create a Kue queue
const queue = kue.createQueue();

// Write a loop to go through the array jobs
jobs.forEach((jobData, index) => {
  // Create a new job and enqueue it
  const job = queue.create('push_notification_code_2', jobData).save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    } else {
      console.error(`Error creating notification job: ${err}`);
    }
  });

  // Listen for job completion
  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  // Listen for job failure
  job.on('failed', (err) => {
    console.error(`Notification job ${job.id} failed: ${err}`);
  });

  // Listen for job progress
  job.on('progress', (progress) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});

// Gracefully handle process termination
process.on('SIGINT', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || '');
    process.exit(0);
  });
});
