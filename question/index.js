const func = require('../src/utils/func');
const fuzzy = require('fuzzy');
const _ = require('lodash');

module.exports = {
    mainQuestion: [
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                'Start to search',
                'List all searchable fields',
                'Quit'
            ]
        },
    ],
    searchQuestion: (entitiesArray) => {
        return [
            {
                type: 'list',
                name: 'entity',
                message: 'What entity do you want to search?',
                choices: func.formateEntitiesName(entitiesArray, true)
            }
        ];
    },
    keywordQuestion: [
        {
            type: 'input',
            name: 'keyword',
            message: 'Enter your keyword(press enter if you want to search empty field):'
        }
    ],

    fieldQuestion: (entityFieldsSet) => {
        let entityFieldsArr = Array.from(entityFieldsSet);
        return [
            {
                type: 'autocomplete',
                name: 'field',
                message: 'Select a field to search',
                source: function(answersSoFar, input) {
                    input = input || '';
                    return new Promise(function(resolve) {
                        setTimeout(function() {
                        let fuzzyResult = fuzzy.filter(input, entityFieldsArr);
                        resolve(
                            fuzzyResult.map(function(el) {
                            return el.original;
                            })
                        );
                        }, 30);
                    });
                }
            }
        ];
    }
};