import faker from 'faker';

export function syncGenerate(n, start, generator) {
  const res = [];
  let i = n;
  while (i) {
    if (generator) {
      res.push(generator());
    } else {
      res.push({
        active: faker.random.boolean(),
        title: faker.random.words(),
        index: start + res.length,
        date: faker.date.past().toString(),
        email: faker.internet.email(),
      });
    }
    i--;
  }
  return res;
}

export function asyncGenerate(n, start, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const res = syncGenerate(n, start);
      resolve(res);
    }, timeout);
  });
}

export function syncGenerateSparse(n, start, length, generator) {
  const res = new Array(start);
  let i = 0;
  while (i < n) {
    if (generator) {
      res.push(generator());
    } else {
      res.push({
        active: faker.random.boolean(),
        title: faker.random.words(),
        index: start + i + 1,
        date: faker.date.past().toString(),
        email: faker.internet.email(),
      });
    }
    i++;
  }
  return res;
}

export function asyncGenerateSparse(n, start, length, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const res = syncGenerateSparse(n, start, length);
      resolve(res);
    }, timeout);
  });
}
