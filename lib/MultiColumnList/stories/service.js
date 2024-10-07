import faker from 'faker';

const baseGenerator = (start, res, i) => ({
  active: faker.random.boolean(),
  title: faker.random.words(),
  index: (start || 0) + res.length,
  date: faker.date.past().toString(),
  email: faker.internet.email(),
  status: faker.random.boolean(),
  phone: faker.phone.phoneNumber(),
  name: faker.name.findName(),
});

const baseGenerateSparse = (start, res, i) => ({
  active: faker.random.boolean(),
  title: faker.random.words(),
  index: start + i + 1,
  date: faker.date.past().toString(),
  email: faker.internet.email(),
});

export function syncGenerate(n, start = 0, generator = baseGenerator) {
  const res = [];
  let i = start;
  while (i < n) {
    res.push(generator(start, res, i));
    i++;
  }
  return res;
}

export function asyncGenerate(n, start, timeout = 0, test = false, generator = baseGenerator) {
  return new Promise(resolve => {
    setTimeout(() => {
      const res = syncGenerate(n, start, generator);
      resolve(res);
    }, test ? 0 : timeout);
  });
}

export function syncGenerateSparse(n, start, length, generator = baseGenerateSparse) {
  const res = new Array(start);
  let i = 0;
  while (i < n) {
    res.push(generator(start, res, i));
    i++;
  }
  return res;
}

export function asyncGenerateSparse(n, start, length, timeout = 0, generator = baseGenerator) {
  return new Promise(resolve => {
    setTimeout(() => {
      const res = syncGenerateSparse(n, start, length, generator);
      resolve(res);
    }, timeout);
  });
}
