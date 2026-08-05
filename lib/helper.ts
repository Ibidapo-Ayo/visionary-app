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
