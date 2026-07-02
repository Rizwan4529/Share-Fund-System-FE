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

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function formatTimelineLabel(months: number): string {
  return `${months}-month plan`;
}
