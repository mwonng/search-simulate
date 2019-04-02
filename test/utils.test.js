const test = require('ava');
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

test('reverseMap()', t => {
    let result = func.reverseMap({
        "1" : "23",
        "2" : "23",
        "5" : "41",
        "4" : "12"
    });
    let expect = {
        "23" : new Set(["1", "2"]),
        "41" : new Set(["5"]),
        "12" : new Set(["4"])
    };
    t.deepEqual(result, expect);
});

test('arrayMapToObject()', t => {
    let result = func.arrayMapToObject([
        {
            "_id"  : "1",
            "name" : "Enthaze",
        },
        {
            "_id"  : "2",
            "name" : "Flask",
        }
    ], "_id");
    let expect = {
        "1" : {
            "_id"  : "1",
            "name" : "Enthaze",
        },
        "2" : {
            "_id"  : "2",
            "name" : "Flask",
        },
    };
    t.deepEqual(result, expect);
});