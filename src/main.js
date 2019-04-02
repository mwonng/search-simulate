const inquirer      = require('inquirer');
const chalk         = require("chalk");
const SETTING       = require('../setting');
const DataHandler   = require('./helpers/DataHandler');
const func          = require('../src/utils/func');
const SearchService = require('./helpers/SearchService');
const question      = require('../question/index');
const output        = require('../src/utils/output');
const error         = require('../src/utils/error');

module.exports = {
    search: async () => {
        const Search      = new SearchService();
        const Data        = new DataHandler();
        let entitiesArray = Data.loadingEntitiesList();

        let searchAns = await inquirer.prompt(question.searchQuestion(entitiesArray));
        let entity    = searchAns.entity.trim().toLowerCase();
        let field     = searchAns.field.trim().toLowerCase();

        // loading and check attributes/field first
        let attrSet = Data.loadingFields(entity);
        if (attrSet.has(field)) {
            let keywordAnswer = await inquirer.prompt(question.keywordQuestion);
            let keyword = keywordAnswer.keyword.trim().toLowerCase();
            output.line("---------------------------------------------");
            output.line(`Searching '${entity}' on '${field}' with value '${keyword}'`);

            let res = await Search.loadingResponse(entity, field, keyword);
            let withJoinedData = Data.prepareRelatedData(res, entity);

            if (withJoinedData.length > 0) {
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
        output.pagenatePrint(func.formateEntitiesName(entitiesArray),SETTING.SEARCH_RESULT_PER_PAGE, listEntityFields);

        function listEntityFields(entity) {
            let data = Data.loadingFields(entity);
            output.line("---------------------------------------------");
            output.line(chalk.yellow(`Available fields for ${func.capitalize(entity)}:`));
            output.line("---------------------------------------------");
            data.forEach(attr => output.line(chalk.grey(attr)));
            output.line("  ");
        }
    },

    hello: () => {
        output.line(chalk.cyan("----------------------------------------------------------------------------------------------------"));
        output.line(chalk.cyan("dP     dP           dP dP           d8888888P                         dP                   dP       "));
        output.line(chalk.cyan("88     88           88 88                .d8'                         88                   88       "));
        output.line(chalk.cyan("88aaaaa88  .d8888b. 88 88 .d8888b.     .d8'   .d8888b. 88d888b. .d888b88 .d8888b. .d8888b. 88  .dP  "));
        output.line(chalk.cyan("88     88  88ooood8 88 88 88'  `88   .d8'     88ooood8 88'  `88 88'  `88 88ooood8 Y8ooooo. 88888\"  "));
        output.line(chalk.cyan("88     88  88.  ... 88 88 88.  .88  d8'       88.  ... 88    88 88.  .88 88.  ...       88 88  `8b. "));
        output.line(chalk.cyan("dP     dP  `88888P' dP dP `88888P'  Y8888888P `88888P' dP    dP `88888P8 `88888P' `88888P' dP   `YP "));
        output.line(chalk.cyan("----------------------------------------------------------------------------------------------------"));
    }
};