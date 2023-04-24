export function parseVideoWords(chineseArr: string[][], tooltipWords: DictWord[][]) {
  const arr = [];
  for (let i = 0; i < chineseArr.length; i++) {
    arr.push(itirateWordsFromDB(chineseArr[i], tooltipWords[i]));
  }
  return arr;
}

export const itirateWordsFromDB = (allwords: string[], wordsFromDB: DictWord[]) => {
  return allwords.map((word) => {
    for (let i = 0; i < wordsFromDB.length; i++) {
      if (word === wordsFromDB[i].chinese) return wordsFromDB[i];
    }
    return word;
  });
};
