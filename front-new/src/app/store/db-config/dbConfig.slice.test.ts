import { describe, expect, it } from "vitest";
import { dbConfigActions, dbConfigReducer, initialState } from "./dbConfig.slice";

describe("dbConfig reducer", () => {
  it("sets loading flags for setTokensData", () => {
    const nextState = dbConfigReducer(initialState, dbConfigActions.setTokensData());

    expect(nextState.tokens.isLoading).toBe(true);
    expect(nextState.tokens.isLoaded).toBe(false);
    expect(nextState.tokens.error).toBeNull();
  });

  it("stores payload for setTokensDataSuccess", () => {
    const startedState = dbConfigReducer(initialState, dbConfigActions.setTokensData());
    const payload = [{ tokenId: 1, symbol: "ETH" }];

    const nextState = dbConfigReducer(startedState, dbConfigActions.setTokensDataSuccess(payload));

    expect(nextState.tokens.isLoading).toBe(false);
    expect(nextState.tokens.isLoaded).toBe(true);
    expect(nextState.tokens.response).toEqual(payload);
  });
});

