import test from 'ava';
const SETTING = require('../setting');
const DataHandler = require('../src/DataHandler');
const users = require('../datasource/users.json');
const organizations = require('../datasource/organizations.json');

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
  ])
  t.deepEqual(result, expetation);
});

// test('getJoinedFields() for user', t => {
//   const Data = new DataHandler();
//   let fields = new Set(Data.getJoinedFields('users'));
//   let expect = new Set(['organization', 'as_submitter', 'as_assignee']);
//   t.deepEqual(fields, expect);
// });

// test('getOneBelongsToData() for user', t => {
//   const Data = new DataHandler();
//   const record = user[0]
//   let fields = Data.getOneBelongsToData('organizations', 119, 'name');
//   let expect = 'Multron';
//   t.deepEqual(fields, expect);
// });

test('joinBelongesData() for user', t => {

  t.pass()
});

test('joinHasManyData() for user', t => {

  t.pass()
});


test('getOneBelongsToData() for user', t => {
  const Data = new DataHandler();
  let current = users[0]
  let result = Data.getOneBelongsToData(
      current,
      {
        'entity'            : 'users',
        'entity_field'      : 'name',
        'toEntity'          : 'organizations',
        'toEntity_field'    : 'name',
        'foreign_key_name'  : 'organization_id',
        'field_on_entity'   : 'users_organization',
        'field_on_toEntity' : 'organization_users'
      }
    );
  let expect = {users_organization: "Multron"};
  t.deepEqual(result, expect)
});

test('getOneHasManyToData() for user', t => {
  const Data = new DataHandler();
  let current = organizations[0];
  let result = Data.getOneHasManyToData(
      current,
      {
        'entity'            : 'users',
        'entity_field'      : 'name',
        'toEntity'          : 'organizations',
        'toEntity_field'    : 'name',
        'foreign_key_name'  : 'organization_id',
        'field_on_entity'   : 'users_organization',
        'field_on_toEntity' : 'organization_users'
      }
    );
  let expect = {
    organization_users: ["Loraine Pittman", "Francis Bailey", "Haley Farmer", "Herrera Norman"]
  }
  t.deepEqual(result, expect)
});
