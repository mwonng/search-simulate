const func = require('../src/utils/func');

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
            },
            {
                type: 'input',
                name: 'field',
                message: 'Enter your destination field',
            }
        ];
    },
    keywordQuestion: [
        {
            type: 'input',
            name: 'keyword',
            message: 'Enter your keyword(press enter if you want to search empty field):'
        }
    ]
}