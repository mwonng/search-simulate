#!/usr/bin/env node
var inquirer = require('inquirer');
var DataHandler = require('./src/DataHandler');
var SETTING = require('./setting');
const func = require('./src/func');
var SearchService = require('./src/SearchService');
console.log("+--------------------------------------+");
console.log('|      Welcome to Zendesk search       |');
console.log("+--------------------------------------+");


async function main() {
    const Search = new SearchService();
    const Data = new DataHandler();

    try {
        let entitiesArray = await Data.loadingEntitiesList();
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
                let attrSet = await Data.loadingFields(entity);

                if (attrSet.has(field)) {
                    let keywordAnswer = await inquirer.prompt(keywordQuestion);
                    console.log("---------------------------------------------")
                    console.log(`Searching '${entity}' on '${field}' with value '${keywordAnswer.keyword}'`)
                    let res = await Search.loadingResponse(entity.toLowerCase(), field, keywordAnswer.keyword);
                    Search.output(res);
                } else {
                    console.log("Error: This field looks not available, please try another field.");
                }
                break;
            case 'List all searchable fields':
                entitiesArray.forEach( async (entity) => {
                    let data = await Search.listAvailableFields(entity);
                    console.log("---------------------------------------------")
                    console.log(`Available fields for ${entity}:`)
                    console.log("---------------------------------------------")
                    data.forEach(attr => console.log(attr))
                    console.log("  ")
                })
                break;
            case 'Quit':
                process.exit(1);
            default:
        }
    } catch (err) {
        console.log(err);
    }
}

main();