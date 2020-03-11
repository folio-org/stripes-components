import faker from 'faker';

export default function generate(num) {
  const arr = [];
  let cur = num;
  while (cur) {
    const obj = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      userName: faker.random.word(),
      joinDate: faker.date.past().toString(),
      index: arr.length,
    };
    arr.push(obj);
    cur--;
  }
  return arr;
}
