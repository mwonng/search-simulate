## Summary
simulate search

## Screebshot

## Requirement

node >= 10,
npm or yarn

## How to run
`./index.js` or `node index.js`

## Setting

- `SEARCH_RESULT_PER_PAGE`:
- `RES_TYPE`:
- `DATA_FOLDER`:
- `REMOTE_END_POINT`:
- `FETCH_ENTITIES`:

## Production / Build

`npm run build` or `yarn build`

## Test

`npm run test` or `yarn test`

## How to add more local entities

put your json file into `datasource/` folder

## How to switch to fetch remote data

*customize the request url to match your own response*

for any search, you have three params to send in `findRemote(entity, field, keyword` in `./src/SearchService.js`

- entity : the entity you are looking for search
- field : the field you are looking for search
- keyword : the value match your keyword.
