var fs = require('fs');
var SETTING = require('../setting');
var DataHandler = require('./DataHandler');
const axios = require('axios');
const func = require('./func');


class Search {

    findLocal(entity, field, keyword) {
        // check entity extension

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
            results.forEach((record, index) => {
                console.log(`------Result: ${index + 1}/${count}-------`);
                Object.keys(record).forEach(key => {
                    let line = func.readableLine(key, record[key]);
                    console.log(line)
                })
            })
        } else {
            console.log("Result:")
            console.log("No record founded")
        }
    }

    async listAvailableFields(entityName) {
        if (SETTING.RES_TYPE === 'local') {
            return DataHandler.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entityName}`);
        } else {
            return await DataHandler.getRemoteEntityFields(`${SETTING.REMOTE_END_POINT}/${entityName}`);
        }
    }
}

module.exports = Search;