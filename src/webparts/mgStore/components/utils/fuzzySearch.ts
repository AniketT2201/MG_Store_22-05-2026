/**
 * Small dependency-free fuzzy matching used to power "did you mean…"
 * suggestions when an exact substring search returns no results (e.g. a
 * typo like "hedphones" should still surface "Headphones").
 *
 * This is intentionally simple — a normalized Levenshtein distance over
 * whole words plus a substring bonus — rather than pulling in a fuzzy
 * search library, since the existing search already fetches the full
 * active product list client-side and just needs a better ranking pass
 * over data it already has.
 */

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Returns a 0-1 similarity score between a search query and a candidate
 * string. 1 = exact/substring match, 0 = no meaningful similarity.
 */
export function fuzzyScore(query: string, candidate: string): number {
  const q = query.trim().toLowerCase();
  const c = candidate.trim().toLowerCase();
  if (!q || !c) return 0;

  if (c.includes(q)) return 1;

  // Compare against the closest individual word rather than the whole
  // string, so "hedphones" scores well against "Wireless Headphones Pro".
  const words = c.split(/\s+/);
  let best = 0;
  for (const word of words) {
    const distance = levenshtein(q, word);
    const maxLen = Math.max(q.length, word.length);
    const similarity = maxLen === 0 ? 0 : 1 - distance / maxLen;
    if (similarity > best) best = similarity;
  }
  return best;
}

export interface FuzzyMatchable {
  ID: number;
  Title: string;
}

/**
 * Ranks a list of items by fuzzy similarity to the query and returns the
 * top matches above a similarity threshold. Used as a fallback when a
 * strict search returns zero results.
 */
export function fuzzySuggest<T extends FuzzyMatchable>(
  query: string,
  items: T[],
  { limit = 5, threshold = 0.6 }: { limit?: number; threshold?: number } = {}
): T[] {
  return items
    .map((item) => ({ item, score: fuzzyScore(query, item.Title) }))
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
