#!/usr/bin/env node
const inquirer = require('inquirer');
const DataHandler = require('./src/DataHandler');
const SETTING = require('./setting');
const func = require('./src/utils/func');
const error = require('./src/utils/error');
const output = require('./src/utils/output');
const chalk = require("chalk");
const figlet = require("figlet");
const SearchService = require('./src/SearchService');

function hello() {
    output(
        chalk.cyan(
        figlet.textSync("Hello  Zendesk", {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
        )
    );
}

async function main() {
    hello();
    const Search = new SearchService();
    const Data = new DataHandler();

    try {
        let entitiesArray = Data.loadingEntitiesList();
        let formatedEntitiesName = func.formatedEntitiesName(entitiesArray);

        const mainQuestion =  [
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
        ];
        const searchQuestion = [
            {
                type: 'list',
                name: 'entity',
                message: 'What entity do you want to search?',
                choices: formatedEntitiesName
            },
            {
                type: 'input',
                name: 'field',
                message: 'Enter your destination field'
            },
        ];
        const keywordQuestion = [
            {
                type: 'input',
                name: 'keyword',
                message: 'Enter your keyword(press enter if you want to search empty field):'
            }
        ];

        let mainAction = await inquirer.prompt(mainQuestion);

        switch (mainAction.action) {
            case 'Start to search':
                let searchQues = await inquirer.prompt(searchQuestion);

                let entity = searchQues.entity.trim().toLowerCase();
                let field = searchQues.field.trim().toLowerCase();

                // loading attributes set for entity
                let attrSet = Data.loadingFields(entity);

                if (attrSet.has(field)) {
                    let keywordAnswer = await inquirer.prompt(keywordQuestion);
                    output("---------------------------------------------")
                    output(`Searching '${entity}' on '${field}' with value '${keywordAnswer.keyword}'`)
                    let res = await Search.loadingResponse(entity.toLowerCase(), field, keywordAnswer.keyword);
                    Search.output(res);
                } else {
                    error('Error: This field looks not available, please try another field.', true)
                }
                break;
            case 'List all searchable fields':
                entitiesArray.forEach( async (entity) => {
                    let data = await Search.listAvailableFields(entity);
                    output("---------------------------------------------")
                    output(`Available fields for ${entity}:`)
                    output("---------------------------------------------")
                    data.forEach(attr => console.log(attr))
                    output("  ")
                })
                break;
            case 'Quit':
                process.exit(1);
            default:
        }
    } catch (err) {
        error(err, true)
    }
}

main();