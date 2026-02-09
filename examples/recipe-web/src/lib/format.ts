import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * Converts ingredient amounts based on serving size changes.
 * e.g.: convertAmount("200", 2, 4) => "400"
 *       convertAmount("1/2", 2, 4) => "1"
 */
export function convertAmount(
  amount: string,
  originalServings: number,
  targetServings: number
): string {
  if (originalServings === targetServings) return amount;
  if (!amount || amount === "to taste" || amount === "dash") return amount;

  const ratio = targetServings / originalServings;

  // Fraction handling (e.g.: "1/2", "2/3")
  if (amount.includes("/")) {
    const parts = amount.split("/");
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        const result = (numerator / denominator) * ratio;
        return formatDecimal(result);
      }
    }
    return amount;
  }

  // Number handling
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;

  const result = num * ratio;
  return formatDecimal(result);
}

function formatDecimal(value: number): string {
  if (Number.isInteger(value)) return String(value);
  // Round to one decimal place
  const rounded = Math.round(value * 10) / 10;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1);
}

/**
 * Formats a date string.
 */
export function formatDate(dateString: string, pattern = "yyyy.MM.dd"): string {
  try {
    const date = parseISO(dateString);
    return format(date, pattern, { locale: enUS });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string as relative time.
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Formats cooking time into a human-readable format.
 * e.g.: 90 => "1h 30min", 30 => "30min"
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}min`;
}

/**
 * Returns the full day name.
 */
export function getDayName(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE", { locale: enUS });
  } catch {
    return "";
  }
}

/**
 * Returns the short day name.
 */
export function getShortDayName(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "EEE", { locale: enUS });
  } catch {
    return "";
  }
}
