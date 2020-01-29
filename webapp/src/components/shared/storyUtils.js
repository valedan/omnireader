import _ from 'lodash';

const findCurrentPost = story =>
  _.maxBy(story.posts, post => post.progressUpdatedAt) || story.posts[0];

const calculateStoryProgress = story => {
  if (story.posts.length === 0) return 0;
  const currentPost = findCurrentPost(story);
  if (!currentPost) return 0;

  const totalPosts = story.posts.length;
  const completedPosts = currentPost.number - 1;
  return ((completedPosts + 1 * currentPost.progress) / totalPosts) * 100;
};

export default { findCurrentPost, calculateStoryProgress };
