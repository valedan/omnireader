import faker from 'faker';

export const build = attributes => {
  return {
    canonicalUrl: faker.internet.url(),
    title: faker.commerce.productName(),
    author: faker.name.findName(),
    details: {},
    ...attributes,
  };
};
