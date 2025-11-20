export function createNgrams(text: string): string[] {
  if (!text) return [];

  const chars = [...text];
  const ngrams = new Set<string>();

  // 1글자 ~ 전체 길이까지
  for (let start = 0; start < chars.length; start++) {
    for (let end = start + 1; end <= chars.length; end++) {
      const slice = chars.slice(start, end).join('');
      ngrams.add(slice);
    }
  }

  return Array.from(ngrams);
}

export function createTaggedNgrams({ nick, title }: any) {
  const result = new Set<string>();

  createNgrams(nick).forEach((n) => result.add(`nick:${n}`));
  createNgrams(title).forEach((n) => result.add(`title:${n}`));
  //   createNgrams(desc).forEach((n) => result.add(`desc:${n}`));

  return Array.from(result);
}
