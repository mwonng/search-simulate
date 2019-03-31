import test from 'ava';
import user from '../datasource/users.json';
import cus from '../datasource/customers.json';
var SearchService = require('../src/SearchService');

test('local - search field is string', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'name', "Loraine Pittman");
  var exp = user.filter( u => u.name === "Loraine Pittman")
  t.deepEqual(result, exp);
});

test('local - search field is bool', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'active', 'true');
  var exp = user.filter( u => u.active === true)
  t.deepEqual(result, exp);
});

test('local - search field is empty', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'description', '');
  var exp = cus.filter( u => u.active === '')
  t.deepEqual(result, exp);
});

test('local - search field is array', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'tags', 'Leola');
  var exp = user.filter( u => u.tags.includes('Leola'))
  t.deepEqual(result, exp);
});

test('local - result is not exist', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', '_id', '0');
  var exp = user.filter( u => u._id === 0)
  t.deepEqual(result, exp);
});

// test remote response
test('Remote - search field is string', async t => {
  const Search = new SearchService();
  var result = await Search.findRemote('users', 'name', "Loraine Pittman");
  var exp = [{
    "_id": 5,
    "url": "http://initech.zendesk.com/api/v2/users/5.json",
    "external_id": "29c18801-fb42-433d-8674-f37d63e637df",
    "name": "Loraine Pittman",
    "alias": "Mr Ola",
    "created_at": "2016-06-12T08:49:19 -10:00",
    "active": true,
    "verified": false,
    "shared": false,
    "locale": "zh-CN",
    "timezone": "Monaco",
    "last_login_at": "2013-07-03T06:59:27 -10:00",
    "email": "olapittman@flotonic.com",
    "phone": "9805-292-618",
    "signature": "Don't Worry Be Happy!",
    "organization_id": 101,
    "tags": [
      "Frizzleburg",
      "Forestburg",
      "Sandston",
      "Delco"
    ],
    "suspended": false,
    "role": "admin"
  }]
  t.deepEqual(result, exp);
});

test('Remote - search field is bool', async t => {
  const Search = new SearchService();
  var result = await Search.findRemote('users', 'active', 'true');
  var exp = 39
  t.deepEqual(result.length, exp);
});

test('Remote - search field is empty', async t => {
  const Search = new SearchService();
  var result = await Search.findRemote('users', 'description', '');
  var exp = cus.filter( u => u.active === '')
  t.deepEqual(result, exp);
});

test('Remote - search field is array', async t => {
  const Search = new SearchService();
  var result = await Search.findRemote('users', 'tags', 'Leola');
  var exp = [{
    "_id": 23,
    "url": "http://initech.zendesk.com/api/v2/users/23.json",
    "external_id": "e9db9277-af4a-4ca6-99e0-291c8a97623e",
    "name": "Francis Bailey",
    "alias": "Miss Singleton",
    "created_at": "2016-03-21T07:12:28 -11:00",
    "active": true,
    "verified": false,
    "shared": false,
    "locale": "en-AU",
    "timezone": "Antarctica",
    "last_login_at": "2012-12-01T11:14:01 -11:00",
    "email": "singletonbailey@flotonic.com",
    "phone": "9584-582-815",
    "signature": "Don't Worry Be Happy!",
    "organization_id": 101,
    "tags": [
      "Leola",
      "Graball",
      "Yogaville",
      "Tivoli"
    ],
    "suspended": false,
    "role": "agent"
  }];
  t.deepEqual(result, exp);
});

test('Remote - result is not exist', async t => {
  const Search = new SearchService();
  var result = await Search.findRemote('users', '_id', '0');
  var exp = [];
  t.deepEqual(result, exp);
});