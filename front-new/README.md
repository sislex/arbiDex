
  # Crypto Arbitrage Admin Panel

  This is a code bundle for Crypto Arbitrage Admin Panel. The original project is available at https://www.figma.com/design/5D2ccbskXcclV6vXTZtkIs/Crypto-Arbitrage-Admin-Panel.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## State management

  The app now uses `redux` + `redux-saga`.

  - Store: `src/app/store/index.ts`
  - Db config state (ported from old NgRx flow): `src/app/store/db-config/*`

  ## Tests

  Run `npm run test` to execute reducer/saga tests.
