import nock from 'nock';
import { setupDatabase, setupApi, readFixture } from '#/helpers';
import { Story } from '/models/story';
import { Post } from '/models/post';
import { generateStory } from '#/factories/story';
import { generatePost } from '#/factories/post';

setupDatabase();
setupApi();

const postUrl = 'https://www.fanfiction.net/s/13120599/1/';
const story = generateStory();
const post = generatePost({ url: postUrl });

const setupSavedPost = async () => {
  const savedStory = await Story.query().insert(story);
  const [savedPost] = await savedStory.$relatedQuery('posts').insert([post]);
  return savedPost;
};

describe('Query: post', () => {
  const GET_POST = gql`
    query getPost($id: ID!) {
      post(id: $id) {
        title
        content
      }
    }
  `;

  context('When post does not exist', () => {
    it('returns a not found error', async () => {
      const res = await query({
        query: GET_POST,
        variables: { id: 10 },
      });

      const error = res.errors[0];
      expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      expect(error.message).toStrictEqual('Post not found!');
    });
  });

  context('When post exists', () => {
    context('When post cannot be retrieved', () => {
      it('returns a server error', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(500);

        const savedPost = await setupSavedPost();
        const res = await query({
          query: GET_POST,
          variables: { id: savedPost.id },
        });

        const error = res.errors[0];
        expect(error.extensions.code).toStrictEqual('INTERNAL_SERVER_ERROR');
        // TODO: I don't want to leak internal errors through the api like this. Need to figure out how to provide error messages for server errors.
        expect(error.message).toStrictEqual(
          'Request failed with status code 500',
        );
      });
    });

    context('When post can be retrieved', () => {
      const hpmor = readFixture('ffn_hpmor_post_1.html');

      it('returns post content', async () => {
        nock('https://www.fanfiction.net')
          .get('/s/13120599/1/')
          .reply(200, hpmor);
        const savedPost = await setupSavedPost();

        const res = await query({
          query: GET_POST,
          variables: { id: savedPost.id },
        });

        expect(res.data.post.title).toStrictEqual(savedPost.title);
        expect(res.data.post.content).toMatch(/Post Content/);
      });
    });
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
  context('When post does not exist', () => {
    it('returns a not found error', async () => {
      const res = await mutate({
        mutation: UPDATE_PROGRESS,
        variables: { postId: 1000, progress: 0 },
      });
      expect(res.errors[0].message).toStrictEqual('NotFoundError');
    });
  });

  context('When post exists', () => {
    context('When given an invalid progress', () => {
      it('returns a user input error', async () => {
        const savedPost = await setupSavedPost();

        const res = await mutate({
          mutation: UPDATE_PROGRESS,
          variables: { postId: savedPost.id, progress: -1 },
        });
        const error = res.errors[0];
        expect(error.extensions.code).toStrictEqual('BAD_USER_INPUT');
      });
    });

    context('When given a valid progress', () => {
      it('updates progress and timestamp', async () => {
        const savedPost = await setupSavedPost();

        const res = await mutate({
          mutation: UPDATE_PROGRESS,
          variables: { postId: savedPost.id, progress: 0.45 },
        });
        const updatedPost = await Post.query().findById(savedPost.id);
        expect(res.errors).toBeUndefined(undefined);
        expect(updatedPost.progress).toStrictEqual(0.45);
        expect(updatedPost.progressUpdatedAt.toDateString()).toStrictEqual(
          new Date().toDateString(),
        );
      });
    });
  });
});
