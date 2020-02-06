import faker from 'faker';
import { Post } from '/models';

export const build = attributes => {
  return {
    url: faker.internet.url(),
    title: faker.commerce.productName(),
    number: faker.random.number(),
    ...attributes,
  };
};

export const create = async attributes => {
  return Post.query().insert(build(attributes));
};
