import test from 'ava';
const func = require('../src/utils/func');

test('formatedEntitiesName()', t => {
  let result = func.formatedEntitiesName(['test.json', 'entity.json']);
  let expect = ['Test', 'Entity'];
  t.deepEqual(result, expect);
});

test('capitalize()', t => {
  let result = func.capitalize('word');
  let expect = 'Word';
  t.is(result, expect);
});