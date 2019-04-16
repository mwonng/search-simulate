const test    = require('ava');
const SETTING = require('../setting');
const File    = require('../src/helpers/FileLoader');

test('isDataReady()', t => {
    let list       = File.isDataReady(SETTING.DATA_FOLDER+"1");
    let expetation = false;
    t.is(list, expetation);
});

test('loadingFieldsFromEntity()', t => {
    let entityName = 'organizations';
    let result     = File.loadingFieldsFromEntity(entityName);
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
    ]);
    t.deepEqual(result, expetation);
});

test('loadingAllEntities()', t => {
    let list       = File.loadingAllEntities(SETTING.DATA_FOLDER);
    let expetation = ['organizations.json','tickets.json','users.json'];
    t.deepEqual(list, expetation);
});

test('generateEntityIndex()', t => {
    let list       = File.generateEntityIndex('users','organization_id');
    let expetation = 119;
    t.deepEqual(list['75'], expetation);
});

test('generateAllIndex()', t => {
    let index        = File.generateAllIndex();
    let users_expet  = ['organization_id_organizations', 'submitter_id_tickets', 'assignee_id_tickets'];
    let org_expet    = ['organization_id_users', 'organization_id_tickets'];
    let ticket_expet = ['submitter_id_users', 'assignee_id_users', 'organization_id_organizations'];
    t.deepEqual(Object.keys(index.users), users_expet);
    t.deepEqual(Object.keys(index.organizations), org_expet);
    t.deepEqual(Object.keys(index.tickets), ticket_expet);
});

test('loadingMappedEntity()', t => {
    let list       = File.loadingMappedEntity();
    let mainKeys   = [ 'organizations', 'tickets', 'users' ];
    let lengthOrg  = 25;
    let lengTicket = 200;
    let lengUser   = 75;
    t.deepEqual(Object.keys(list), mainKeys);
    t.deepEqual(Object.keys(list.organizations).length, lengthOrg);
    t.deepEqual(Object.keys(list.tickets).length, lengTicket);
    t.deepEqual(Object.keys(list.users).length, lengUser);
});