import gql from 'graphql-tag';
import { setupDatabase, setupApi, readFixture, nockGet } from '#/helpers';
import { Story } from '/models';
import { PostFactory } from '#/factories/';
import { reloadRecord } from '../../helpers';

setupDatabase();
const server = setupApi();

describe('Query: post', () => {
  const GET_POST = gql`
    query getPost($id: ID!) {
      post(id: $id) {
        title
        content
      }
    }
  `;

  const getPostQuery = ({ postId }) => {
    return server.query({
      query: GET_POST,
      variables: { id: postId },
    });
  };

  test('returns a not found error if post does not exist', async () => {
    const res = await getPostQuery({ postId: 10 });

    const error = res.errors[0];
    expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
    expect(error.message).toMatchInlineSnapshot(`"Post not found!"`);
  });

  test('returns a server error when post cannot be scraped', async () => {
    const savedPost = await PostFactory.create();
    nockGet(savedPost.url).reply(500);

    const res = await getPostQuery({ postId: savedPost.id });

    const error = res.errors[0];
    expect(error.extensions.code).toStrictEqual('INTERNAL_SERVER_ERROR');
    expect(error.message).toMatchInlineSnapshot(`"Unable to retrieve post!"`);
  });

  test('returns the scraped post content', async () => {
    const hpmor = readFixture('ffn_hpmor_chapter_1.html');
    const savedPost = await PostFactory.create({
      url: 'https://www.fanfiction.net/s/1',
    });
    nockGet(savedPost.url).reply(200, hpmor);

    const res = await getPostQuery({ postId: savedPost.id });

    expect(res.data.post.title).toStrictEqual(savedPost.title);
    expect(res.data.post.content).toMatchInlineSnapshot(
      `"<p>Post Content</p>"`,
    );
  });
});

describe('Mutation: updateProgress', () => {
  const UPDATE_PROGRESS = gql`
    mutation updateProgress($postId: ID!, $progress: Float!) {
      updateProgress(postId: $postId, progress: $progress) {
        id
        progress
      }
    }
  `;

  test('returns a not found error when post does not exist', async () => {
    const res = await server.mutate({
      mutation: UPDATE_PROGRESS,
      variables: { postId: 10, progress: 0 },
    });

    expect(res.errors[0].message).toStrictEqual('NotFoundError');
  });

  test('returns a user input error when progress is invalid', async () => {
    const savedPost = await PostFactory.create();

    const res = await server.mutate({
      mutation: UPDATE_PROGRESS,
      variables: { postId: savedPost.id, progress: -1 },
    });

    const error = res.errors[0];
    expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
    expect(error.message).toMatchInlineSnapshot(`"Invalid progress value!"`);
  });

  test('updates progress and related timestamp', async () => {
    const savedPost = await PostFactory.create();

    const res = await server.mutate({
      mutation: UPDATE_PROGRESS,
      variables: { postId: savedPost.id, progress: 0.45 },
    });

    await reloadRecord(savedPost);
    expect(res.errors).toBeUndefined();
    expect(savedPost.progress).toStrictEqual(0.45);
    expect(Math.floor(savedPost.progressUpdatedAt / 1000)).toStrictEqual(
      Math.floor(new Date() / 1000), // times within 1 second
    );
  });
});

describe('Mutation: createPost', () => {
  const CREATE_POST = gql`
    mutation createPost($url: String!) {
      createPost(url: $url) {
        title
        story {
          title
        }
      }
    }
  `;

  test('when post is already in library ', async () => {
    const savedPost = await PostFactory.create();

    const res = await server.mutate({
      mutation: CREATE_POST,
      variables: { url: savedPost.url },
    });

    const error = res.errors[0];
    expect(error.extensions.exception.post.id).toStrictEqual(savedPost.id);
    expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
    expect(error.message).toMatchInlineSnapshot(
      `"Post is already in your library!"`,
    );
  });

  test('returns an error when site cannot be scraped', async () => {
    const targetUrl = 'http://foo.com';
    nockGet(targetUrl).reply(500);

    const res = await server.mutate({
      mutation: CREATE_POST,
      variables: { url: targetUrl },
    });

    const error = res.errors[0];
    expect(error.extensions.code).toStrictEqual('INTERNAL_SERVER_ERROR');
    expect(error.message).toMatchInlineSnapshot(`"Could not parse site!"`);
  });

  test('scrapes a story', async () => {
    const targetUrl = 'https://www.fanfiction.net/s/1';
    const hpmor = readFixture('ffn_hpmor_chapter_1.html');
    nockGet(targetUrl).reply(200, hpmor);

    const res = await server.mutate({
      mutation: CREATE_POST,
      variables: { url: targetUrl },
    });

    const savedStory = await Story.query()
      .findOne({ canonicalUrl: targetUrl })
      .eager('posts');

    expect(savedStory.title).toMatchInlineSnapshot(
      `"Harry Potter and the Methods of Rationality"`,
    );
    expect(res.data.createPost.title).toMatchInlineSnapshot(
      `"Harry Potter and the Methods of Rationality"`,
    );
    expect(savedStory.posts.map(post => post.title)).toMatchInlineSnapshot(`
      Array [
        "Harry Potter and the Methods of Rationality",
      ]
    `);
  });

  test('scrapes a standalone post', async () => {
    //TODO
  });
});
