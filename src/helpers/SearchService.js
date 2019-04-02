const SETTING = require('../../setting');
const normalizeLetter = require('../utils/func').normalizeLetter;
class Search {
    /**
     * find method locally
     * @param {String} entity   lowercase
     * @param {String} field    lowercase
     * @param {String} keyword  lowercase
     */
    findLocal(entity, field, keyword) {
        const data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let res = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let currRecord = data[i];

            if (Array.isArray(currRecord[field])) {                         // if aim field is array, search in this array;
                let lowerValueList = currRecord[field].map( ele => normalizeLetter(ele));
                let set = new Set(lowerValueList);
                if (set.has(normalizeLetter(keyword))) {
                    res = [...res, currRecord];
                }
            }

            if (currRecord[field] === undefined && keyword === "") {        // for empty field
                res = [...res, currRecord];
            }

            if (
                currRecord[field] !== undefined &&
                normalizeLetter(currRecord[field].toString()) === normalizeLetter(keyword)
            ) {
                res = [...res, currRecord];            // full value search
            }
        }
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