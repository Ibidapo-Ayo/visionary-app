export const getInitials = (
  firstName?: string,
  lastName?: string,
  email?: string,
) => {
  const firstInitial = firstName?.trim()?.charAt(0) ?? "";
  const lastInitial = lastName?.trim()?.charAt(0) ?? "";

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (email?.trim()?.charAt(0) ?? "V").toUpperCase();
};

export function getCurrentSession() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const hour = new Date().getHours();
  return hour < 15 ? "morning" : "evening";
}

export const getBibleReadingDayNumber = (startDate: string) => {
  const start = new Date(startDate);
  const today = new Date();

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Adding 1 to make it 1-based instead of 0-based
};
