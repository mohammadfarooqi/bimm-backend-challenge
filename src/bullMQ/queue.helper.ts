import { Queue } from 'bullmq';

export const isQueueEmpty = async (queue: Queue): Promise<boolean> => {
  const waitingCount = await queue.getWaitingCount();
  const activeCount = await queue.getActiveCount();
  const completedCount = await queue.getCompletedCount();
  const failedCount = await queue.getFailedCount();
  const delayedCount = await queue.getDelayedCount();

  return (
    waitingCount === 0 &&
    activeCount === 0 &&
    completedCount === 0 &&
    failedCount === 0 &&
    delayedCount === 0
  );
};

export const removeAllJobs = async (totalQueues: Queue[]): Promise<boolean> => {
  try {
    const statuses: Array<
      | 'completed'
      | 'wait'
      | 'active'
      | 'paused'
      | 'prioritized'
      | 'delayed'
      | 'failed'
    > = [
      'completed',
      'wait',
      'active',
      'paused',
      'prioritized',
      'delayed',
      'failed',
    ];

    for (const queue of totalQueues) {
      const cleanBatch = statuses.map((status) =>
        queue.clean(0, 100000, status),
      );
      await Promise.all(cleanBatch);
    }
    console.log('All jobs removed from the queue.');
    return true;
  } catch (error) {
    console.log('Error while removing jobs', error);
    return error;
  }
};
