import faker from 'faker';

export const generatePost = attributes => {
  return {
    url: faker.internet.url(),
    title: faker.commerce.productName(),
    number: faker.random.number(),
    ...attributes,
  };
};
