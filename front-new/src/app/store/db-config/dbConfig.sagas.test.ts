import { runSaga } from "redux-saga";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { dbConfigApi } from "./dbConfig.api";
import { handleSetTokensData } from "./dbConfig.sagas";
import { dbConfigActions } from "./dbConfig.slice";

describe("dbConfig sagas", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses cached tokens when they already exist", async () => {
    const dispatched: any[] = [];
    const apiSpy = vi.spyOn(dbConfigApi, "getTokens");

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          dbConfig: {
            tokens: {
              response: [{ tokenId: 11, symbol: "CACHED" }],
            },
          },
        }),
      },
      handleSetTokensData,
    ).toPromise();

    expect(dispatched).toEqual([
      dbConfigActions.setTokensDataSuccess([{ tokenId: 11, symbol: "CACHED" }]),
    ]);
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it("loads tokens from api when cache is empty", async () => {
    const dispatched: any[] = [];
    vi.spyOn(dbConfigApi, "getTokens").mockResolvedValue([{ tokenId: 1, symbol: "ETH" }]);

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          dbConfig: {
            tokens: {
              response: [],
            },
          },
        }),
      },
      handleSetTokensData,
    ).toPromise();

    expect(dispatched).toEqual([
      dbConfigActions.setTokensDataSuccess([{ tokenId: 1, symbol: "ETH" }]),
    ]);
  });
});

