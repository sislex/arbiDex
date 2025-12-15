export const emptyAsyncResponse = <Example>(response: Example) => ({
  startTime: null,
  loadingTime: null,
  isLoading: false,
  isLoaded: false,
  response
});
