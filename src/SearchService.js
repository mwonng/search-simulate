const SETTING = require('../setting');
const DataHandler = require('./DataHandler');
const axios = require('axios');
const func = require('./utils/func');
const output = require('./utils/func');
const inquirer = require('inquirer');


class Search {
    /**
     * find method locally
     * @param {String} entity
     * @param {String} field
     * @param {String} keyword
     */
    findLocal(entity, field, keyword) {
        // import data
        var data = DataHandler.jsonResolver(`${SETTING.DATA_FOLDER}/${entity}.json`);

        // get result
        let res = data.filter(record => {
            // field type? array?
            if (Array.isArray(record[field])) {
                var set = new Set(record[field]);
                return set.has(keyword);
            }

            if (record[field] !== undefined) {
                return record[field].toString() === keyword
            }
        });

        return res;
    }

    /**
     * get response from find method;
     * @param {String} entity
     * @param {String} field
     * @param {String} keyword
     */
    async loadingResponse(entity, field, keyword) {
        return this.findLocal(entity, field, keyword);
    }

    output(results) {
        let count = results.length;
        if (count) {
            this.pagenatePrint(results, SETTING.SEARCH_RESULT_PER_PAGE);
        } else {
            output("Result:")
            output("No record founded")
        }
    }

    /**
     * If results are too many, show record by paginator. default setting on ./setting.json
     * @param {Array} records
     * @param {Int} countPerPage
     */
    async pagenatePrint(records, countPerPage) {
        let currentPage = 1;
        let maxIndex = records.length;
        let lastPage = Math.ceil(maxIndex / countPerPage);

        while (currentPage <= lastPage) {
            for (let i = (currentPage - 1) * countPerPage ; i < currentPage * countPerPage && i < maxIndex; i++) {
                output(`------Result: ${i + 1}/${maxIndex}-------`);
                let currentRecord = records[i];
                Object.keys(currentRecord).forEach(key => {
                    let line = func.readableLine(key, currentRecord[key]);
                    output(line)
                });
            }
            if (currentPage < lastPage) {
                const userInput = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'continue',
                        message: `page ${currentPage}/ ${lastPage}, press 'Enter' to next page, press 'q' or 'ctrl + c' to exit:`
                    }
                ])
                if (userInput.continue === 'q') {
                    process.exit(1);
                }
            }
            currentPage++;
        }
    }

    /**
     * List fields for one entity;
     * @param {String} entityName
     */
    async listAvailableFields(entityName) {
        const Data = new DataHandler();
        return Data.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entityName}`);
    }
}

module.exports = Search;