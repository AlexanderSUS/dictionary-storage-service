import { RawDataSet } from 'src/types/textProcessing';

function extractNewWords(dataSet: RawDataSet[], dbWords: string[]) {
  const dbWordsSet = new Set<string>(dbWords);

  return dataSet.reduce((accumulator, set) => {
    const { sentence, words } = set;

    const filteredWords = words.reduce((acc, value) => {
      if (!dbWordsSet.has(value)) {
        acc.push(value);
        dbWordsSet.add(value);
      }

      return acc;
    }, []);

    if (filteredWords.length) {
      accumulator.push({
        sentence,
        words: filteredWords,
      });
    }

    return accumulator;
  }, [] as RawDataSet[]);
}

export default extractNewWords;
