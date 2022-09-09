import { LINE_BRAKE } from 'src/const/const';

// TODO REMOVE IF NO NEEDED
function markTerminator(text: string) {
  const processedText: string[] = [];

  let terminatorFlag = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (terminatorFlag && char === ' ') {
      processedText.push(LINE_BRAKE);

      terminatorFlag = false;

      continue;
    }

    if (terminatorFlag) {
      terminatorFlag = false;
    }

    processedText.push(char);

    if ((char === '!' || char === '?' || char === '.') && i < text.length - 1) {
      terminatorFlag = true;
    }
  }

  return processedText.join('');
}

function removeEmptyValues(words: string[]) {
  return words.filter((word) => word !== '');
}

function removeDigits(words: string[]) {
  return words.reduce((acc, word) => {
    if (!word[0].match(/\d/)) {
      acc.push(word);
    }

    return acc;
  }, [] as string[]);
}

function removeAnyNonAlphabeticalChar(word: string) {
  let handledWord = word;

  while (handledWord.length && !handledWord[0].match(/[A-Za-z]/)) {
    handledWord = removeCharFromStart(handledWord);
  }

  while (
    handledWord.length &&
    !handledWord[handledWord.length - 1].match(/[A-Za-z]/)
  ) {
    handledWord = removeChareFromEnd(handledWord);
  }

  return handledWord;
}

function removeCharFromStart(word: string) {
  return word.slice(1, word.length - 1);
}

function removeChareFromEnd(word: string) {
  return word.slice(0, -1);
}

export default function extractWordsFromText(text: string) {
  let rawWords = text.split(' ');

  rawWords = removeEmptyValues(rawWords);
  rawWords = removeDigits(rawWords);
  rawWords = rawWords.map((word) => removeAnyNonAlphabeticalChar(word));
  rawWords = removeEmptyValues(rawWords);

  const uniqWords = new Set(rawWords.map((word) => word.toLowerCase()));

  return Array.from(uniqWords) as string[];
}
