import faker from 'faker';

export default function generate(num, generator) {
  const arr = [];
  let cur = num;
  while (cur) {
<<<<<<< HEAD
    const obj = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      userName: faker.random.word(),
      joinDate: faker.date.past().toString(),
      index: arr.length,
    };
    arr.push(obj);
=======
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
>>>>>>> master
    cur--;
  }
  return arr;
}
