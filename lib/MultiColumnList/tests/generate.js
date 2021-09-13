import faker from 'faker';

export function generate(num, generator) {
  const arr = [];
  let cur = num;
  while (cur) {
    if (generator) {
      arr.push(generator());
    } else {
      const obj = {
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        userName: faker.random.word(),
        joinDate: faker.date.past().toString(),
      };
      arr.push(obj);
    }
    cur--;
  }
  return arr;
}

export function sparseGenerate(num, start, generator) {
  const res = new Array(start);
  let i = 0;
  while (i < num) {
    if (generator) {
      res.push(generator());
    } else {
      res.push({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        userName: faker.random.word(),
        joinDate: faker.date.past().toString(),
      });
    }
    i++;
  }
  return res;
}
