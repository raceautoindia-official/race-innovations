const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function normalizeIndianMobile(value) {
  if (value === null || value === undefined) return "";

  let digits = String(value).replace(/[\s\-()+]/g, "");

  if (digits.length === 13 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  digits = digits.replace(/\D/g, "");
  return digits;
}

export function isValidIndianMobile(value) {
  const normalized = normalizeIndianMobile(value);
  return INDIAN_MOBILE_REGEX.test(normalized);
}

export const INVALID_MOBILE_MESSAGE =
  "Please enter a valid 10-digit mobile number.";
