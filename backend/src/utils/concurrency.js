import pLimit from 'p-limit';

const DEFAULT_LIMIT = 5;

export const createLimiter = (concurrency = DEFAULT_LIMIT) => {
  return pLimit(concurrency);
};

export const defaultLimiter = createLimiter(DEFAULT_LIMIT);

export const strictLimiter = createLimiter(3);

export const relaxedLimiter = createLimiter(10);

export const limitedAll = async (promiseFns, concurrency = DEFAULT_LIMIT) => {
  const limit = createLimiter(concurrency);
  return Promise.all(promiseFns.map(fn => limit(() => fn())));
};

export const limitedAllSettled = async (promiseFns, concurrency = DEFAULT_LIMIT) => {
  const limit = createLimiter(concurrency);
  return Promise.allSettled(promiseFns.map(fn => limit(() => fn())));
};


export const limitConcurrency = async (items, asyncFn, concurrency = DEFAULT_LIMIT) => {
  const limit = createLimiter(concurrency);
  return Promise.all(items.map(item => limit(() => asyncFn(item))));
};

export const batchProcess = async (items, asyncFn, batchSize = 50, concurrency = DEFAULT_LIMIT) => {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await limitConcurrency(batch, asyncFn, concurrency);
    results.push(...batchResults);
  }

  return results;
};


export const sequential = async (asyncFns, concurrency = 1) => {
  const limit = createLimiter(concurrency);
  const results = [];

  for (const fn of asyncFns) {
    const result = await limit(() => fn());
    results.push(result);
  }

  return results;
};

export default {
  createLimiter,
  defaultLimiter,
  strictLimiter,
  relaxedLimiter,
  limitedAll,
  limitedAllSettled,
  limitConcurrency,
  batchProcess,
  sequential
};
