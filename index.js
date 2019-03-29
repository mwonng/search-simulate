#!/usr/bin/env node
var inquirer = require('inquirer');

console.log('Welcome to Zendesk search');
console.log("Type 'q' to exit at any time.");
console.log("-------------------------------------------");

inquirer.prompt([
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
])
.then(answers => {
    switch (answers.action) {
        case 'Start to search':
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'entity',
                    message: 'What entity do you want to search?',
                    choices: [      // TODO: choices need to be dynamic
                        'Users',
                        'Tickets',
                        'Orgs'
                    ]
                },
                {
                    type: 'input',
                    name: 'field',
                    message: 'Enter your destination field'
                },
                {
                    type: 'input',
                    name: 'keyword',
                    message: 'Enter your keyword:'
                }
            ]).
            then(answers => {
                console.log(JSON.stringify(answers, null, '  '));
                // TODO: add search function
            });
            break;
        case 'List all searchable fields':
            // TODO: add list field function
            console.log("NOT ordered!");
            break;
        case 'Quit':
            process.exit(1);
        default:

    }
});