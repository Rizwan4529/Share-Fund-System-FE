export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

export function getTimeGreeting(firstName: string): string {
  const hr = new Date().getHours();
  const period =
    hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  return `${period}, ${firstName}.`;
}

export function getTodayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Without `currency`, keeps the original "$1,234" output. With an ISO code
 * (e.g. a participant's preferredCurrency) formats in that currency, falling
 * back to USD when the code isn't recognised.
 */
export function formatCurrency(amount: number, currency?: string): string {
  if (!currency) return `$${amount.toLocaleString()}`;
  const format = (code: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  try {
    return format(currency.trim().toUpperCase());
  } catch {
    return format("USD");
  }
}

export function formatTimelineLabel(months: number): string {
  return `${months}-month plan`;
}
