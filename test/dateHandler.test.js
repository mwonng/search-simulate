import test from 'ava';
const SETTING = require('../setting');
const DataHandler = require('../src/DataHandler');


test('getAllLocalEntities()', async (t) => {
  const Data = new DataHandler();
  let list = await Data.getAllLocalEntities(SETTING.DATA_FOLDER);
  let expetation = ['customers.json','organizations.json','tickets.json','users.json'];
  t.deepEqual(list, expetation);
});

test('getLocalEntityFields()', async t => {
  const Data = new DataHandler();
  let entityName = 'organizations.json';
  let result = Data.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entityName}`)
  let expetation = new Set([
    "_id",
    "url",
    "external_id",
    "name",
    "domain_names",
    "created_at",
    "details",
    "shared_tickets",
    "tags"
  ])
  t.deepEqual(result, expetation);
});

test('formatedEntitiesName()', t => {
  t.pass();
});