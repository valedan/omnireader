import { scrape } from '/services/scraper';

export const refreshStory = async story => {
  const currentStory = await scrape({
    url: story.canonicalUrl,
    getStory: true,
  });
  const newPosts = currentStory.posts.slice(story.posts.length);
  newPosts.map(async post => {
    const savedPost = await story.$relatedQuery('posts').insert(post);
    story.posts.push(savedPost);
  });
  return story;
};
