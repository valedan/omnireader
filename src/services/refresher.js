import { scrape } from '/services/scraper';

export const refreshStory = async story => {
  const currentStory = await scrape({
    url: story.canonicalUrl,
    getStory: true,
  });
  const newChapters = currentStory.chapters.slice(story.chapters.length);
  newChapters.map(async chapter => {
    const savedChapter = await story.$relatedQuery('chapters').insert(chapter);
    story.chapters.push(savedChapter);
  });
  return story;
};
