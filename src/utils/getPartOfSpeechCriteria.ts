import { ArrayOverlap, Not } from 'typeorm';

const getPartOfSpeechCriteria = (exclude: string, include: string) => {
  const excludeStrings = exclude && exclude.split(',');
  const includeStrings = include && include.split(',');

  if (exclude) {
    return Not(ArrayOverlap(excludeStrings));
  }

  if (include) {
    return ArrayOverlap(includeStrings);
  }

  return null;
};

export default getPartOfSpeechCriteria;
