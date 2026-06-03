import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { dbConfigApi } from "./dbConfig.api";
import { dbConfigActions } from "./dbConfig.slice";
import {
  selectBotsDataResponse,
  selectCexChainsDataResponse,
  selectCexJobsDataResponse,
  selectCexPairsDataResponse,
  selectChainsDataResponse,
  selectDexesDataResponse,
  selectJobsDataResponse,
  selectPoolsDataResponse,
  selectRpcUrlDataResponse,
  selectServersDataResponse,
  selectSwapRateDataResponse,
  selectTokensDataResponse,
} from "./dbConfig.selectors";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error ?? "Unknown error");
}

function* loadList(
  selectCached: (state: any) => unknown,
  apiCall: () => Promise<any[]>,
  successAction: (payload: any[]) => PayloadAction<any[]>,
  failureAction: (payload: string) => PayloadAction<string>,
) {
  try {
    const cached: unknown = yield select((state: any) => selectCached(state));
    if (Array.isArray(cached) && cached.length > 0) {
      yield put(successAction(cached));
      return;
    }

    const response: any[] = yield call(apiCall);
    yield put(successAction(response));
  } catch (error) {
    yield put(failureAction(getErrorMessage(error)));
  }
}

function* runFreshFetch(
  apiCall: () => Promise<any[]>,
  successAction: (payload: any[]) => PayloadAction<any[]>,
  failureAction: (payload: string) => PayloadAction<string>,
) {
  try {
    const response: any[] = yield call(apiCall);
    yield put(successAction(response));
  } catch (error) {
    yield put(failureAction(getErrorMessage(error)));
  }
}

export function* handleSetTokensData() {
  yield call(
    loadList,
    selectTokensDataResponse,
    dbConfigApi.getTokens,
    dbConfigActions.setTokensDataSuccess,
    dbConfigActions.setTokensDataFailure,
  );
}

function* handleSetPoolsData() {
  yield call(
    loadList,
    selectPoolsDataResponse,
    dbConfigApi.getPools,
    dbConfigActions.setPoolsDataSuccess,
    dbConfigActions.setPoolsDataFailure,
  );
}

function* handleSetDexesData() {
  yield call(
    loadList,
    selectDexesDataResponse,
    dbConfigApi.getDexes,
    dbConfigActions.setDexesDataSuccess,
    dbConfigActions.setDexesDataFailure,
  );
}

function* handleSetChainsData() {
  yield call(
    loadList,
    selectChainsDataResponse,
    dbConfigApi.getChains,
    dbConfigActions.setChainsDataSuccess,
    dbConfigActions.setChainsDataFailure,
  );
}

function* handleSetJobsData() {
  yield call(
    loadList,
    selectJobsDataResponse,
    dbConfigApi.getJobs,
    dbConfigActions.setJobsDataSuccess,
    dbConfigActions.setJobsDataFailure,
  );
}

function* handleSetBotsData() {
  yield call(
    loadList,
    selectBotsDataResponse,
    dbConfigApi.getBots,
    dbConfigActions.setBotsDataSuccess,
    dbConfigActions.setBotsDataFailure,
  );
}

function* handleSetServersData() {
  yield call(
    loadList,
    selectServersDataResponse,
    dbConfigApi.getServers,
    dbConfigActions.setServersDataSuccess,
    dbConfigActions.setServersDataFailure,
  );
}

function* handleSetRpcUrlsData() {
  yield call(
    loadList,
    selectRpcUrlDataResponse,
    dbConfigApi.getRpcUrls,
    dbConfigActions.setRpcUrlsDataSuccess,
    dbConfigActions.setRpcUrlsDataFailure,
  );
}

function* handleSetSwapRateData() {
  yield call(
    loadList,
    selectSwapRateDataResponse,
    dbConfigApi.getSwapRate,
    dbConfigActions.setSwapRateDataSuccess,
    dbConfigActions.setSwapRateDataFailure,
  );
}

function* handleSetCexChainsData() {
  yield call(
    loadList,
    selectCexChainsDataResponse,
    dbConfigApi.getCexChains,
    dbConfigActions.setCexChainsDataSuccess,
    dbConfigActions.setCexChainsDataFailure,
  );
}

function* handleSetCexPairsData() {
  yield call(
    loadList,
    selectCexPairsDataResponse,
    dbConfigApi.getCexPairs,
    dbConfigActions.setCexPairsDataSuccess,
    dbConfigActions.setCexPairsDataFailure,
  );
}

function* handleSetCexJobsData() {
  yield call(
    loadList,
    selectCexJobsDataResponse,
    dbConfigApi.getCexJobs,
    dbConfigActions.setCexJobsDataSuccess,
    dbConfigActions.setCexJobsDataFailure,
  );
}

function* handleInitTokensListPage() {
  yield put(dbConfigActions.setTokensData());
  yield put(dbConfigActions.setChainsData());
}

function* handleInitPoolsPage() {
  yield put(dbConfigActions.setPoolsData());
  yield put(dbConfigActions.setTokensData());
  yield put(dbConfigActions.setDexesData());
  yield put(dbConfigActions.setChainsData());
  yield put(dbConfigActions.setSwapRate());
}

function* handleInitJobsListPage() {
  yield put(dbConfigActions.setJobsData());
  yield put(dbConfigActions.setChainsData());
  yield put(dbConfigActions.setRpcUrlsData());
}

function* handleInitBotsListPage() {
  yield put(dbConfigActions.setBotsData());
  yield put(dbConfigActions.setJobsData());
  yield put(dbConfigActions.setServersData());
  yield put(dbConfigActions.setCexJobsData());
}

function* handleInitCexPairsPage() {
  yield put(dbConfigActions.setCexPairsData());
  yield put(dbConfigActions.setCexChainsData());
}

function* handleInitCexJobsListPage() {
  yield put(dbConfigActions.setCexJobsData());
  yield put(dbConfigActions.setCexChainsData());
  yield put(dbConfigActions.setCexPairsData());
}

function* handleRefetchPoolsPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getPools, dbConfigActions.setPoolsDataSuccess, dbConfigActions.setPoolsDataFailure),
    call(runFreshFetch, dbConfigApi.getTokens, dbConfigActions.setTokensDataSuccess, dbConfigActions.setTokensDataFailure),
    call(runFreshFetch, dbConfigApi.getDexes, dbConfigActions.setDexesDataSuccess, dbConfigActions.setDexesDataFailure),
    call(runFreshFetch, dbConfigApi.getChains, dbConfigActions.setChainsDataSuccess, dbConfigActions.setChainsDataFailure),
    call(runFreshFetch, dbConfigApi.getSwapRate, dbConfigActions.setSwapRateDataSuccess, dbConfigActions.setSwapRateDataFailure),
  ]);
}

function* handleRefetchJobsListPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getJobs, dbConfigActions.setJobsDataSuccess, dbConfigActions.setJobsDataFailure),
    call(runFreshFetch, dbConfigApi.getChains, dbConfigActions.setChainsDataSuccess, dbConfigActions.setChainsDataFailure),
    call(runFreshFetch, dbConfigApi.getRpcUrls, dbConfigActions.setRpcUrlsDataSuccess, dbConfigActions.setRpcUrlsDataFailure),
  ]);
}

function* handleRefetchBotsListPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getBots, dbConfigActions.setBotsDataSuccess, dbConfigActions.setBotsDataFailure),
    call(runFreshFetch, dbConfigApi.getJobs, dbConfigActions.setJobsDataSuccess, dbConfigActions.setJobsDataFailure),
    call(runFreshFetch, dbConfigApi.getServers, dbConfigActions.setServersDataSuccess, dbConfigActions.setServersDataFailure),
    call(runFreshFetch, dbConfigApi.getCexJobs, dbConfigActions.setCexJobsDataSuccess, dbConfigActions.setCexJobsDataFailure),
  ]);
}

function* handleRefetchCexPairsPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getCexPairs, dbConfigActions.setCexPairsDataSuccess, dbConfigActions.setCexPairsDataFailure),
    call(runFreshFetch, dbConfigApi.getCexChains, dbConfigActions.setCexChainsDataSuccess, dbConfigActions.setCexChainsDataFailure),
  ]);
}

function* handleRefetchCexJobsListPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getCexJobs, dbConfigActions.setCexJobsDataSuccess, dbConfigActions.setCexJobsDataFailure),
    call(runFreshFetch, dbConfigApi.getCexChains, dbConfigActions.setCexChainsDataSuccess, dbConfigActions.setCexChainsDataFailure),
    call(runFreshFetch, dbConfigApi.getCexPairs, dbConfigActions.setCexPairsDataSuccess, dbConfigActions.setCexPairsDataFailure),
  ]);
}

function* handleRefetchTokensListPageResources() {
  yield all([
    call(runFreshFetch, dbConfigApi.getTokens, dbConfigActions.setTokensDataSuccess, dbConfigActions.setTokensDataFailure),
    call(runFreshFetch, dbConfigApi.getChains, dbConfigActions.setChainsDataSuccess, dbConfigActions.setChainsDataFailure),
  ]);
}

export function* dbConfigSaga() {
  yield all([
    takeLatest(dbConfigActions.initTokensListPage.type, handleInitTokensListPage),
    takeLatest(dbConfigActions.initPoolsPage.type, handleInitPoolsPage),
    takeLatest(dbConfigActions.initJobsListPage.type, handleInitJobsListPage),
    takeLatest(dbConfigActions.initBotsListPage.type, handleInitBotsListPage),
    takeLatest(dbConfigActions.initCexPairsPage.type, handleInitCexPairsPage),
    takeLatest(dbConfigActions.initCexJobsListPage.type, handleInitCexJobsListPage),

    takeLatest(dbConfigActions.setTokensData.type, handleSetTokensData),
    takeLatest(dbConfigActions.setPoolsData.type, handleSetPoolsData),
    takeLatest(dbConfigActions.setDexesData.type, handleSetDexesData),
    takeLatest(dbConfigActions.setChainsData.type, handleSetChainsData),
    takeLatest(dbConfigActions.setJobsData.type, handleSetJobsData),
    takeLatest(dbConfigActions.setBotsData.type, handleSetBotsData),
    takeLatest(dbConfigActions.setServersData.type, handleSetServersData),
    takeLatest(dbConfigActions.setRpcUrlsData.type, handleSetRpcUrlsData),
    takeLatest(dbConfigActions.setSwapRate.type, handleSetSwapRateData),
    takeLatest(dbConfigActions.setCexChainsData.type, handleSetCexChainsData),
    takeLatest(dbConfigActions.setCexPairsData.type, handleSetCexPairsData),
    takeLatest(dbConfigActions.setCexJobsData.type, handleSetCexJobsData),

    takeLatest(dbConfigActions.refetchTokensData.type, function* refetchTokens() {
      yield call(runFreshFetch, dbConfigApi.getTokens, dbConfigActions.setTokensDataSuccess, dbConfigActions.setTokensDataFailure);
    }),
    takeLatest(dbConfigActions.refetchPoolsData.type, function* refetchPools() {
      yield call(runFreshFetch, dbConfigApi.getPools, dbConfigActions.setPoolsDataSuccess, dbConfigActions.setPoolsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchDexesData.type, function* refetchDexes() {
      yield call(runFreshFetch, dbConfigApi.getDexes, dbConfigActions.setDexesDataSuccess, dbConfigActions.setDexesDataFailure);
    }),
    takeLatest(dbConfigActions.refetchChainsData.type, function* refetchChains() {
      yield call(runFreshFetch, dbConfigApi.getChains, dbConfigActions.setChainsDataSuccess, dbConfigActions.setChainsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchJobsData.type, function* refetchJobs() {
      yield call(runFreshFetch, dbConfigApi.getJobs, dbConfigActions.setJobsDataSuccess, dbConfigActions.setJobsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchBotsData.type, function* refetchBots() {
      yield call(runFreshFetch, dbConfigApi.getBots, dbConfigActions.setBotsDataSuccess, dbConfigActions.setBotsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchServersData.type, function* refetchServers() {
      yield call(runFreshFetch, dbConfigApi.getServers, dbConfigActions.setServersDataSuccess, dbConfigActions.setServersDataFailure);
    }),
    takeLatest(dbConfigActions.refetchRpcUrlsData.type, function* refetchRpcUrls() {
      yield call(runFreshFetch, dbConfigApi.getRpcUrls, dbConfigActions.setRpcUrlsDataSuccess, dbConfigActions.setRpcUrlsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchSwapRate.type, function* refetchSwapRateData() {
      yield call(runFreshFetch, dbConfigApi.getSwapRate, dbConfigActions.setSwapRateDataSuccess, dbConfigActions.setSwapRateDataFailure);
    }),
    takeLatest(dbConfigActions.refetchCexChainsData.type, function* refetchCexChains() {
      yield call(runFreshFetch, dbConfigApi.getCexChains, dbConfigActions.setCexChainsDataSuccess, dbConfigActions.setCexChainsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchCexPairsData.type, function* refetchCexPairs() {
      yield call(runFreshFetch, dbConfigApi.getCexPairs, dbConfigActions.setCexPairsDataSuccess, dbConfigActions.setCexPairsDataFailure);
    }),
    takeLatest(dbConfigActions.refetchCexJobsData.type, function* refetchCexJobs() {
      yield call(runFreshFetch, dbConfigApi.getCexJobs, dbConfigActions.setCexJobsDataSuccess, dbConfigActions.setCexJobsDataFailure);
    }),

    takeLatest(dbConfigActions.refetchPoolsPageResources.type, handleRefetchPoolsPageResources),
    takeLatest(dbConfigActions.refetchJobsListPageResources.type, handleRefetchJobsListPageResources),
    takeLatest(dbConfigActions.refetchBotsListPageResources.type, handleRefetchBotsListPageResources),
    takeLatest(dbConfigActions.refetchCexPairsPageResources.type, handleRefetchCexPairsPageResources),
    takeLatest(dbConfigActions.refetchCexJobsListPageResources.type, handleRefetchCexJobsListPageResources),
    takeLatest(dbConfigActions.refetchTokensListPageResources.type, handleRefetchTokensListPageResources),
  ]);
}
