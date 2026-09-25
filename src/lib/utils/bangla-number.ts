const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  return String(num).replace(/\d/g, (digit) => banglaDigits[Number(digit)] || digit);
}
