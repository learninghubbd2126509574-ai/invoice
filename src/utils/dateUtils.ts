export const getTodayFormattedDate = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("en-US", options); // e.g. "August 19, 2026"
};
