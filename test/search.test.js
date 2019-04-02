import test from 'ava';
import user from '../datasource/users.json';
const SearchService = require('../src/SearchService');

test('local - search field is string', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'name', "Loraine Pittman");
  const exp = user.filter( u => u.name === "Loraine Pittman")
  t.deepEqual(result.length, exp.length);
});

test('local - search field is bool', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'active', 'true');
  const exp = user.filter( u => u.active === true)
  t.deepEqual(result.length, exp.length);
});

test('local - search field is empty', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'description', '');
  const exp = user.filter( u => u.description === '')
  t.deepEqual(result, exp);
});

test('local - search field is array', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', 'tags', 'Leola');
  const exp = user.filter( u => u.tags.includes('Leola'))
  t.deepEqual(result.length, exp.length);
});

test('local - result is not exist', t => {
  const Search = new SearchService();
  const result = Search.findLocal('users', '_id', '0');
  const exp = user.filter( u => u._id === 0)
  t.deepEqual(result, exp);
});