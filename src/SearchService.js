var fs = require('fs');
var SETTING = require('../setting');
var DataHandler = require('./DataHandler');
const axios = require('axios');
const func = require('./func');
var inquirer = require('inquirer');


class Search {

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

    async findRemote(entity, field, keyword) {
        let res = await axios.get(`${SETTING.REMOTE_END_POINT}/${entity}/search?field=${field}&value=${keyword}`);
        return res.data;
    }

    async loadingResponse(entity, field, keyword) {
        return SETTING.RES_TYPE === 'remote' ?
            await this.findRemote(entity, field, keyword) :
            this.findLocal(entity, field, keyword);
    }

    output(results) {
        let count = results.length;
        if (count) {
            this.pagenatePrint(results, SETTING.SEARCH_RESULT_PER_PAGE);
        } else {
            console.log("Result:")
            console.log("No record founded")
        }
    }

    async pagenatePrint(records, countPerPage) {
        let currentPage = 1;
        let maxIndex = records.length;
        let lastPage = Math.ceil(maxIndex / countPerPage);

        while (currentPage <= lastPage) {
            for (let i = (currentPage - 1) * countPerPage ; i < currentPage * countPerPage && i < maxIndex; i++) {
                console.log(`------Result: ${i + 1}/${maxIndex}-------`);
                let currentRecord = records[i];
                Object.keys(currentRecord).forEach(key => {
                    let line = func.readableLine(key, currentRecord[key]);
                    console.log(line)
                });
            }
            if (currentPage < lastPage) {
                const userInput = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'continue',
                        message: 'press Enter for next page, press q or Ctrl + c to quit:'
                    }
                ])
                if (userInput.continue === 'q') {
                    process.exit(1);
                }
            }
            currentPage++;
        }
    }

    async listAvailableFields(entityName) {
        const Data = new DataHandler();
        if (SETTING.RES_TYPE === 'local') {
            return Data.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entityName}`);
        } else {
            return await Data.getRemoteEntityFields(`${SETTING.REMOTE_END_POINT}/${entityName}`);
        }
    }
}

module.exports = Search;