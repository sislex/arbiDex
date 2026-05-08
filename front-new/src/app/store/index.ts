import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { dbConfigReducer } from "./db-config/dbConfig.slice";
import { dbConfigSaga } from "./db-config/dbConfig.sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    dbConfig: dbConfigReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware);
  },
});

sagaMiddleware.run(dbConfigSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

