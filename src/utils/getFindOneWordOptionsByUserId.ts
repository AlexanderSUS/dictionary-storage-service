export default function getFindOneOptionsByUserId(
  word: string,
  userId: string,
) {
  return {
    where: {
      user: { id: userId },
      word: { word },
    },
    relations: {
      word: true,
    },
  };
}
