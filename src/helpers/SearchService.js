const SETTING = require('../../setting');

class Search {
    /**
     * find method locally
     * @param {String} entity
     * @param {String} field
     * @param {String} keyword
     */
    findLocal(entity, field, keyword) {
        const data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);

        let res = data.filter(record => {
            if (Array.isArray(record[field])) {                         // if aim field is array, search in this array;
                var set = new Set(record[field]);
                return set.has(keyword);
            }

            if (record[field] === undefined && keyword === "") {        // for empty field
                return record;
            }

            if (record[field] !== undefined) {
                return record[field].toString() === keyword;            // full value search
            }
        });

        return res;
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
}

module.exports = Search;