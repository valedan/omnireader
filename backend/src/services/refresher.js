import { fetchStory } from './scraper';

export const refreshStory = async story => {
  const currentStory = await fetchStory(story.canonicalUrl);
  const newChapters = currentStory.chapters.slice(story.chapters.length);
  for (const chapter of newChapters) {
    const savedChapter = await story.$relatedQuery('chapters').insert(chapter);
    story.chapters.push(savedChapter);
  }
  console.log('returning from refresh');
  return story;
};
