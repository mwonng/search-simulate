const inquirer      = require('inquirer');
const chalk         = require("chalk");
const figlet        = require("figlet");
const SETTING       = require('../setting');
const DataHandler   = require('../src/DataHandler');
const func          = require('../src/utils/func');
const SearchService = require('../src/SearchService');
const question      = require('../question/index');
const output        = require('../src/utils/output');
const error         = require('../src/utils/error');

module.exports = {
    search: async () => {
        const Search = new SearchService();
        const Data = new DataHandler();
        let entitiesArray = Data.loadingEntitiesList();

        let searchAns = await inquirer.prompt(question.searchQuestion(entitiesArray));
        let entity = searchAns.entity.trim();
        let field = searchAns.field.trim();

        // loading and check attributes/field first
        let attrSet = Data.loadingFields(entity);
        if (attrSet.has(field)) {
            let keywordAnswer = await inquirer.prompt(question.keywordQuestion);
            output.line("---------------------------------------------");
            output.line(`Searching '${entity}' on '${field}' with value '${keywordAnswer.keyword}'`);

            let res = await Search.loadingResponse(entity, field, keywordAnswer.keyword);
            let withJoinedData = Data.prepareRelatedData(res, entity);

            if (withJoinedData.length) {
                output.pagenatePrint(withJoinedData, SETTING.SEARCH_RESULT_PER_PAGE, output.readableAttrPrint);
            } else {
                output.line('-------------------------');
                error("No record founded.", false);
            }
        } else {
            error('This field looks not available, please try another field.', true);
        }
    },

    list: () => {
        const Data = new DataHandler();
        let entitiesArray = Data.loadingEntitiesList();
        func.formateEntitiesName(entitiesArray)
            .forEach(entity => {
                let data = Data.loadingFields(entity);
                output.line("---------------------------------------------");
                output.line(`Available fields for ${entity}:`);
                output.line("---------------------------------------------");
                data.forEach(attr => output.line(attr));
                output.line("  ");
            });
    },

    hello: () => {
        output.line(
            chalk.cyan(
            figlet.textSync("Hello  Zendesk", {
                font             : "Standard",
                horizontalLayout : "default",
                verticalLayout   : "default"
            })
            )
        );
    }
};