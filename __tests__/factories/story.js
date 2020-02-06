import faker from 'faker';
import { Story } from '/models';

export const build = attributes => {
  return {
    canonicalUrl: faker.internet.url(),
    title: faker.commerce.productName(),
    author: faker.name.findName(),
    details: {},
    ...attributes,
  };
};

export const create = async attributes => {
  return Story.query().insert(build(attributes));
};
