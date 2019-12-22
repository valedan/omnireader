import faker from 'faker';

export const generateChapter = attributes => {
  return {
    url: faker.internet.url(),
    title: faker.commerce.productName(),
    number: faker.random.number(),
    ...attributes,
  };
};