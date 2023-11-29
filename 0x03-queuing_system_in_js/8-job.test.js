import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Create a Kue queue in test mode
    queue = kue.createQueue({ redis: { createClientFactory: kue.redis.createClientFactory } });
    kue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode
    queue.testMode.clear();
    kue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not-an-array', queue)).to.throw('Jobs is not an array');
  });

  it('should create two new jobs to the queue', () => {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 5678 to verify your account' },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check the jobs in the queue
    const jobIds = queue.testMode.jobs.map((job) => job.id);
    expect(jobIds).to.have.lengthOf(2);
    expect(jobIds).to.include.members(['1', '2']);
  });
});
