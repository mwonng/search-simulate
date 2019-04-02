#!/usr/bin/env node
const inquirer = require('inquirer');
const error = require('./src/utils/error');
const question = require('./question/index');
const Main = require('./src/main');

async function main() {
    Main.hello();
    try {
        let mainAction = await inquirer.prompt(question.mainQuestion);
        switch (mainAction.action) {
            case 'Start to search':
                Main.search();
                break;
            case 'List all searchable fields':
                Main.list();
                Main.search();
                break;
            case 'Quit':
            default:
                process.exit(1);
        }
    } catch (err) {
        error(err, true);
    }
}

main();