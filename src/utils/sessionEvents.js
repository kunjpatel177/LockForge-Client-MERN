let onSessionEnded = null;
let isEnding = false;

export const registerSessionEndedHandler = (handler) => {
  onSessionEnded = handler;
};

export const notifySessionEnded = (
  message = 'Your session has expired or been revoked. Please sign in again.',
) => {
  if (isEnding || !onSessionEnded) return;
  isEnding = true;
  onSessionEnded(message);
  window.setTimeout(() => {
    isEnding = false;
  }, 2000);
};
