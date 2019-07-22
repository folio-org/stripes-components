import faker from 'faker';
export function generate(n, start, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      let res = [];
      let i = n;
      while (i) {
        res.push({
          title: faker.random.words(),
          index: start + res.length,
          date: faker.date.past().toString(),
          email: faker.internet.email(),
          contact: faker.helpers.createCard(),
        });
        i--;
      }
    
      resolve(res);
    }, timeout);
  })
}
