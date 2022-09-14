import { Word } from "src/words/entities/word.entity";

export default function normalizePublicWord(wordEntity: Word) {
  return  ({
      word: wordEntity.word,
      phonetic: wordEntity.phonetic,
      audio: wordEntity.audio,
      partOfSpeech: wordEntity.partOfSpeech,
      meaning: wordEntity.meaning,
  })
}