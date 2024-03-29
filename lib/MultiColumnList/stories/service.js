import faker from 'faker';

export function syncGenerate(n, start = 0, generator) {
  const res = [];
  let i = start;
  while (i < n) {
    if (generator) {
      res.push(generator());
    } else {
      res.push({
        active: faker.random.boolean(),
        title: faker.random.words(),
        index: (start || 0) + res.length,
        date: faker.date.past().toString(),
        email: faker.internet.email(),
        status: faker.random.boolean(),
        phone: faker.phone.phoneNumber(),
        name: faker.name.findName(),
      });
    }
    i++;
  }
  return res;
}

export function asyncGenerate(n, start, timeout = 0, test = false) {
  return new Promise(resolve => {
    setTimeout(() => {
      const res = syncGenerate(n, start);
      resolve(res);
    }, test ? 0 : timeout);
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
