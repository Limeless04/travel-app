export const redirectToLogin = () => {
  const currentLocation = window.location.pathname + window.location.search;
  window.location.href = `/auth/login?expired=true&from=${encodeURIComponent(
    currentLocation
  )}`;
};
