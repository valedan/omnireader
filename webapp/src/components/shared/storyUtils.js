import _ from "lodash";

const findCurrentChapter = story =>
  _.maxBy(story.chapters, chapter => chapter.progressUpdatedAt) ||
  story.chapters[0];

const calculateStoryProgress = story => {
  if (story.chapters.length === 0) return 0;
  const currentChapter = findCurrentChapter(story);
  if (!currentChapter) return 0;

  const totalChapters = story.chapters.length;
  const completedChapters = currentChapter.number - 1;
  return (
    ((completedChapters + 1 * currentChapter.progress) / totalChapters) * 100
  );
};

export default { findCurrentChapter, calculateStoryProgress };
