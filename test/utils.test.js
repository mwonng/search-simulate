import test from 'ava';
const func = require('../src/utils/func');

test('formateEntitiesName() with caps', t => {
  let result = func.formateEntitiesName(['test.json', 'entity.json'], true);
  let expect = ['Test', 'Entity'];
  t.deepEqual(result, expect);
});

test('formateEntitiesName() without caps', t => {
  let result = func.formateEntitiesName(['test.json', 'entity.json']);
  let expect = ['test', 'entity'];
  t.deepEqual(result, expect);
});


test('capitalize()', t => {
  let result = func.capitalize('word');
  let expect = 'Word';
  t.is(result, expect);
});