#!/usr/bin/env node
var inquirer = require('inquirer');
var DataHandler = require('./src/DataHandler');
var SETTING = require('./setting');

var SearchService = require('./src/Search');
const Search = new SearchService();
console.log("+--------------------------------------+");
console.log('|      Welcome to Zendesk search       |');
console.log("+--------------------------------------+");

if (!DataHandler.isDataReady(SETTING.DATA_FOLDER)) {
    console.log("Error: Data folder path not exist! Please change your config in setting.js");
    process.exit(1);
}

async function main() {
    let entitiesArray = SETTING.RES_TYPE === 'remote' ?
        await DataHandler.getAllRemoteEntities(SETTING.FETCH_ENTITIES) :
        DataHandler.getAllLocalEntities(SETTING.DATA_FOLDER);
    let formatedEntitiesName = DataHandler.formatedEntitiesName(entitiesArray);
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
    .then( async (answers) => {
        // let list = DataHandler.getAllLocalEntities(SETTING.DATA_FOLDER);
        switch (answers.action) {
            case 'Start to search':
                inquirer.prompt([
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
                ])
                .then( async (answers) => {
                    // if answers.field not exist/
                    let entity = answers.entity.trim().toLowerCase();
                    let field = answers.field.trim().toLowerCase();

                    let attrSet = SETTING.RES_TYPE === 'remote' ?
                        await DataHandler.getRemoteEntityFields(`${SETTING.REMOTE_END_POINT}/${entity}`) :
                        DataHandler.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entity}.json`);

                    if (attrSet.has(field)) {
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'keyword',
                                message: 'Enter your keyword(press enter if you want to search empty field):'
                            }
                        ]).
                        then(answers => {
                            console.log(`Searching ${entity} on ${field} with value ${answers.keyword}`)
                            let res = Search.find(entity.toLowerCase(), field, answers.keyword);
                            Search.output(res);
                        });
                    } else {
                        console.log("Error: This field looks not available, please try another field.");
                    }
                });
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
    });
}

main();