#!/usr/bin/env node
var inquirer = require('inquirer');
var DataHandler = require('./src/DataHandler');
var SearchService = require('./src/Search');
const Search = new SearchService();

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
                    choices: DataHandler.formatedEntitiesName()
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
                console.log(`Searching ${answers.entity} on ${answers.field} with value ${answers.keyword}`)

                let res = Search.find(answers.entity.toLowerCase(), answers.field, answers.keyword);

                Search.output(res);
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