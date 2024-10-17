export function logError(error: Error, context: string) {
  console.error(`Error in ${context}:`, error.message);
  // In a production environment, you might want to send this error to a logging service
}

export function handleApiError(error: Error) {
  logError(error, 'API call');
  // You can add more specific error handling logic here if needed
}