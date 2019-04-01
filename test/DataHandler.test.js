import test from 'ava';
const SETTING = require('../setting');
const DataHandler = require('../src/DataHandler');


test('getAllLocalEntities()', async (t) => {
  const Data = new DataHandler();
  let list = await Data.getAllLocalEntities(SETTING.DATA_FOLDER);
  let expetation = ['organizations.json','tickets.json','users.json'];
  t.deepEqual(list, expetation);
});

test('getLocalEntityFields()', async t => {
  const Data = new DataHandler();
  let entityName = 'organizations';
  let result = Data.getLocalEntityFields(entityName)
  let expetation = new Set([
    "_id",
    "url",
    "external_id",
    "name",
    "domain_names",
    "created_at",
    "details",
    "shared_tickets",
    "tags",
    "users",
    "tickets",
  ])
  t.deepEqual(result, expetation);
});

test('getJoinedFields() for user', t => {
  const Data = new DataHandler();
  let fields = new Set(Data.getJoinedFields('users'));
  let expect = new Set(['organization', 'as_submitter', 'as_assignee']);
  t.deepEqual(fields, expect);
});

test('getOneBelongsToData() for user', t => {
  const Data = new DataHandler();
  let fields = Data.getOneBelongsToData('organizations', 119, 'name');
  let expect = 'Multron';
  t.deepEqual(fields, expect);
});

test('joinBelongesData() for user', t => {

  t.pass()
});

test('joinHasManyData() for user', t => {

  t.pass()
});