const SETTING = require('../setting');
const DataHandler = require('./DataHandler');
const output = require('./utils/output');
const error = require('./utils/error');

class Search {
    /**
     * find method locally
     * @param {String} entity
     * @param {String} field
     * @param {String} keyword
     */
    findLocal(entity, field, keyword) {
        // import data
        const data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);

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

    prepareRelatedData(){

    }

    /**
     * get response from find method;
     * if different data source, search response can be added in this function
     * @param {String} entity
     * @param {String} field
     * @param {String} keyword
     */
    async loadingResponse(entity, field, keyword) {
        return this.findLocal(entity, field, keyword);
    }

    printResults(results) {
        let count = results.length;
        if (count) {
            output.pagenatePrint(results, SETTING.SEARCH_RESULT_PER_PAGE, output.readableAttrPrint);
        } else {
            output.line('-------------------------')
            error("No record founded.", false)
        }
    }
}

module.exports = Search;