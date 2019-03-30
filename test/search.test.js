import test from 'ava';
import user from '../datasource/users.json';
import cus from '../datasource/customers.json';
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

test('search field is empty', t => {
  const Search = new SearchService();
  var result = Search.find('users', 'description', '');
  var exp = cus.filter( u => u.active === '')
  t.deepEqual(result, exp);
});

test('search field is array', t => {
  const Search = new SearchService();
  var result = Search.find('users', 'tags', 'Leola');
  var exp = user.filter( u => u.tags.includes('Leola'))
  t.deepEqual(result, exp);
});

test('result is not exist', t => {
  const Search = new SearchService();
  var result = Search.find('users', '_id', '0');
  var exp = user.filter( u => u._id === 0)
  t.deepEqual(result, exp);
});

test('searh field is not available', t => {
  // const Search = new SearchService();
  // var result = Search.find('users', 'description', '');
  // var exp = cus.filter( u => u.active === '')
  // t.deepEqual(result, exp);
  t.pass();
});

// test('searh entity is not available', t => {
//   t.pass();
// });

// List fields
test('List available fields for search', t => {
  t.pass();
});