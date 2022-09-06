import { LINE_BRAKE } from 'src/const/const';

function markTerminator(text: string) {
  const processedText: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    processedText.push(char);

    if ((char === '!' || char === '?' || char === '.') && i < text.length - 1) {
      processedText.push(LINE_BRAKE);
    }
  }

  return processedText.join('');
}

function removeLastChar(sentece: string) {
  const lastChar = sentece[sentece.length - 1];

  if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
    return sentece.slice(0, -1);
  }

  return sentece;
}

function breakSenteceToWords(sentence: string) {
  return sentence
    .replace(/[!-@{-~]/, ' ')
    .split(' ')
    .filter((word) => word !== ' ' && word !== '');
}

function extractWords(sentence: string) {
  const sentenceWithouTerminator = removeLastChar(sentence);
  const uniqWords = new Set();

  const words = breakSenteceToWords(sentenceWithouTerminator);

  words.forEach((word) => {
    uniqWords.add(word.toLowerCase());
  });

  return Array.from(uniqWords) as string[];
}

function removeNonUniqWords() {
  const uniqWords = new Set();

  return (words: string[]) =>
    words.reduce((acc, nextWord) => {
      if (!uniqWords.has(nextWord)) {
        uniqWords.add(nextWord);

        acc.push(nextWord);
      }
      return acc;
    }, []);
}

function getPureSentences(text: string) {
  const markedText = markTerminator(text);

  return markedText.split(LINE_BRAKE).map((string) => string.trim());
}

const handleText = (text: string) => {
  const sentences = getPureSentences(text);

  const words = sentences.map((sentece) => {
    return extractWords(sentece);
  });

  const filterUniq = removeNonUniqWords();

  return sentences.map((sentence, index) => ({
    sentence,
    words: filterUniq(words[index]),
  }));
};

export default handleText;
