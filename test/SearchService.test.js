const test          = require('ava');
const user          = require('../datasource/users.json');
const SearchService = require('../src/helpers/SearchService');

test('local - search field is string', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'name', "Loraine Pittman");
  const exp    = user.filter( u => u.name === "Loraine Pittman");
  t.deepEqual(result.length, exp.length);
});

test('local - search field is bool', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'active', 'true');
  const exp    = user.filter( u => u.active === true);
  t.deepEqual(result.length, exp.length);
});

test('local - search field is empty', t => {
  const Search = new SearchService();
  const result = Search.findLocal('tickets', 'description', '');
  const exp    = [
    {
      "_id": "4cce7415-ef12-42b6-b7b5-fb00e24f9cc1",
      "url": "http://initech.zendesk.com/api/v2/tickets/4cce7415-ef12-42b6-b7b5-fb00e24f9cc1.json",
      "external_id": "ef665694-aa3f-4960-b264-0e77c50486cf",
      "created_at": "2016-02-25T09:12:47 -11:00",
      "type": "question",
      "subject": "A Nuisance in Ghana",
      "priority": "high",
      "status": "solved",
      "submitter_id": 9,
      "assignee_id": 48,
      "organization_id": 104,
      "tags": [
        "Delaware",
        "New Hampshire",
        "Utah",
        "Hawaii"
      ],
      "has_incidents": false,
      "due_at": "2016-08-05T10:31:03 -10:00",
      "via": "web"
    }
  ];
  t.deepEqual(result, exp);
});

test('local - search field is array', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'tags', 'Leola');
  const exp    = user.filter( u => u.tags.includes('Leola'));
  t.deepEqual(result.length, exp.length);
});

test('local - result is not exist', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', '_id', '0');
  const exp    = user.filter( u => u._id === 0);
  t.deepEqual(result, exp);
});

test('local - search not case sensitive', t => {
  const Search = new SearchService();
  const resultLow = Search.findLocal('users', 'name', 'roman meyers');
  const resultCap = Search.findLocal('users', 'name', 'Roman meyers');
  const exp    = user.filter( u => u.name === "Roman Meyers");
  t.deepEqual(resultLow.length, exp.length);
  t.deepEqual(resultCap.length, exp.length);
});