export function createNgrams(text: string): string[] {
  if (!text) return [];

  const chars = [...text];
  const ngrams = new Set<string>();

  // 1) 유니그램(한 글자씩)
  chars.forEach((c) => ngrams.add(c));

  // 2) 빅그램 (두 글자씩)
  for (let i = 0; i < chars.length - 1; i++) {
    ngrams.add(chars[i] + chars[i + 1]);
  }

  // 3) 전체 문자열도 포함
  ngrams.add(text);

  return Array.from(ngrams);
}
