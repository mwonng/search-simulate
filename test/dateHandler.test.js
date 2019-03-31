import test from 'ava';
const SETTING = require('../setting');
const DataHandler = require('../src/DataHandler');
// import user from '../datasource/users.json';
// import cus from '../datasource/customers.json';
// var SearchService = require('../src/Search');


test('getAllLocalEntities()', async (t) => {
  const Data = new DataHandler();
  let list = await Data.getAllLocalEntities(SETTING.DATA_FOLDER);
  let expetation = ['customers.json','organizations.json','tickets.json','users.json'];
  t.deepEqual(list, expetation);
});

test('getAllRemoteEntities()', async (t) => {
  const Data = new DataHandler();
  let list = await Data.getAllRemoteEntities(SETTING.FETCH_ENTITIES);
  let expetation = ['organizations','users','tickets'];
  t.deepEqual(list, expetation);
});

test('getLocalEntityFields()', t => {
  t.pass();
});

test('getRemoteEntityFields()', t => {
  t.pass();
});

test('formatedEntitiesName()', t => {
  t.pass();
});