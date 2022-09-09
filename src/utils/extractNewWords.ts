function extractNewWords(wordsFromText: string[], wordsFromDb: string[]) {
  const setOfWordsFromDb = new Set<string>(wordsFromDb);

  return wordsFromText.reduce((acc, wordFromText) => {
    if (!setOfWordsFromDb.has(wordFromText)) {
      acc.push(wordFromText);
    }

    return acc;
  }, [] as string[]);
}

export default extractNewWords;
