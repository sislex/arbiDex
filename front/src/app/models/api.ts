export interface API {
  startTime: number | null;
  loadingTime: number | null;
  isLoading: boolean;
  isLoaded: boolean;
  error?: any;
  response?: any;
}
