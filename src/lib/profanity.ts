// Centralized profanity filtering for comments/replies
// Extend this list as needed. Consider normalizing text for more robust checks.

export const bannedPatterns: RegExp[] = [
  // Persian obscene words with common variants
  /احمق/i,
  /(?:ک|ك)[\s‌]*(?:س|ص)/i,
  /(?:ک|ك)[\s‌]*و[\s‌]*ن/i,
  /(?:ک|ك)[\s‌]*و[\s‌]*(?:ص|س)/i,
  /(?:ک|ك)[\s‌]*(?:ی|ي)[\s‌]*ر/i,
  /م[\s‌]*م[\s‌]*ه/i,
  /مادر[\s‌]*خراب/i,
  /مادر[\s‌]*(?:قهوه|قحبه)/i,
  /ر[\s‌]*ی[\s‌]*د/i, // رید
  // Basic Latin transliterations (optional)
  /fuck/i,
  /shit/i,
  /bitch/i,
  /kos/i,
  /koon|kon/i,
  /kir/i,
];

// Remove diacritics, unify Arabic/Persian letter variants, remove ZWNJ and collapse spaces
const ARABIC_DIACRITICS = /[\u064B-\u0652\u0610-\u061A\u06D6-\u06ED]/g;
export const normalizeText = (text: string): string => {
  return (text || '')
    .replace(ARABIC_DIACRITICS, '') // remove diacritics
    .replace(/\u200c/g, '') // remove ZWNJ
    .replace(/\s+/g, ' ') // collapse spaces
    .trim()
    .replace(/\u064A/g, '\u06CC') // ي -> ی
    .replace(/\u0643/g, '\u06A9'); // ك -> ک
};

export const hasProfanity = (text?: string): boolean => {
  if (!text) return false;
  const t = text.toString();
  const n = normalizeText(t);
  return bannedPatterns.some((re) => re.test(t) || re.test(n));
};
