import test from 'ava';
import user from '../datasource/users.json';
import cus from '../datasource/customers.json';
var SearchService = require('../src/SearchService');

test('search field is string', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'name', "Loraine Pittman");
  var exp = user.filter( u => u.name === "Loraine Pittman")
  t.deepEqual(result, exp);
});

test('search field is bool', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'active', 'true');
  var exp = user.filter( u => u.active === true)
  t.deepEqual(result, exp);
});

test('search field is empty', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'description', '');
  var exp = cus.filter( u => u.active === '')
  t.deepEqual(result, exp);
});

test('search field is array', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', 'tags', 'Leola');
  var exp = user.filter( u => u.tags.includes('Leola'))
  t.deepEqual(result, exp);
});

test('result is not exist', t => {
  const Search = new SearchService();
  var result = Search.findLocal('users', '_id', '0');
  var exp = user.filter( u => u._id === 0)
  t.deepEqual(result, exp);
});

// List fields
test('List all users fields', async (t) => {
  const Search = new SearchService();
  var result = await Search.listAvailableFields('users');
  const expetation = new Set([
    '_id',
    'url',
    'external_id',
    'name',
    'alias',
    'created_at',
    'active',
    'verified',
    'shared',
    'locale',
    'timezone',
    'last_login_at',
    'email',
    'phone',
    'signature',
    'organization_id',
    'tags',
    'suspended',
    'role'
  ]);
  t.deepEqual(result, expetation);
});