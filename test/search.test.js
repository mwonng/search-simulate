import test from 'ava';
import user from '../datasource/users.json';
var SearchService = require('../src/Search');

test('search field is string', t => {
  const Search = new SearchService();
  var result = Search.find('users', 'name', "Loraine Pittman");
  var exp = user.filter( u => u.name === "Loraine Pittman")
  t.deepEqual(result, exp);
});

test('search field is bool', t => {
  const Search = new SearchService();
  var result = Search.find('users', 'active', 'true');
  var exp = user.filter( u => u.active === true)
  t.deepEqual(result, exp);
});

test('search field is array', t => {
  t.pass();
});

test('result is not exist', t => {
  const Search = new SearchService();
  var result = Search.find('users', '_id', '3');
  var exp = user.filter( u => u._id === 3)
  t.deepEqual(result, exp);
});

test('searh field is not available', t => {
  t.pass();
});

test('searh entity is not available', t => {
  t.pass();
});

// List fields
test('List available fields for search', t => {
  t.pass();
});