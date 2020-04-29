import faker from 'faker';

export default function generate(num) {
  const arr = [];
  let cur = num;
  while (cur) {
    const obj = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      userName: faker.random.word(),
      joinDate: faker.date.past().toString(),
    };
    arr.push(obj);
    cur--;
  }
  return arr;
}
