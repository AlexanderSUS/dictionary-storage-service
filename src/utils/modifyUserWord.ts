import { ModifiedUserWordDto } from 'src/words/dto/modified-user-word.dto';
import { UserWord } from 'src/words/entities/userWord.entity';

function modifyUserWord(userWord: UserWord): ModifiedUserWordDto {
  const { id, status, word: wordData } = userWord;

  const { id: _, userWords, ...data } = wordData;

  return { id, status, ...data };
}

export default modifyUserWord;
