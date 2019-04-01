const SETTING = require('../setting');
const fs = require('fs');
const func = require('./utils/func');

class DataHandler {
    isDataReady(folderPath) {
        if (!fs.existsSync(folderPath)) return false;
        if (fs.readdirSync(folderPath).length <= 1) return false;
        return true;
    }

    loadingEntitiesList() {
        return this.getAllLocalEntities(SETTING.DATA_FOLDER);
    }

    loadingFields(entity) {
        return this.getLocalEntityFields(entity);
    }

    getAllLocalEntities(folderPath) {
        if (!this.isDataReady(folderPath)) {
            throw new Error("Error: getAllLocalEntities() cannot get entities from folder");
        }
        return fs.readdirSync(folderPath);
    }

    /**
     * getEntityFields() get all available fields in entity among all records in entity
     * @param   {String}  entityPath
     * @return  {Set}     attributes set
     */
    getLocalEntityFields(entity) {
        // get original attr as max for all records
        const data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let attr = new Set();
        data.forEach(record => {
            attr = new Set([...attr, ...Object.keys(record)]);
        })

        // get related attr from schema
        let relatedAttr = this.getJoinedFields(entity);
        let joinedAttr = new Set([...attr, ...relatedAttr]);

        return joinedAttr;
    }

    getJoinedFields(entity) {
        var schema = require(`${SETTING.SCHEMA_FOLDER}/${entity}`);
        let fields = schema.map(setting => setting.joined_name);
        return new Set(fields);
    }

    getOneBelongsToData(destinationEntity, forKeyValue, value_from_field, pkey='_id') {
        let belongsToEntity = require(`${SETTING.DATA_FOLDER}/${destinationEntity}.json`);
        let relatedRecord = belongsToEntity.find((el)=> el[pkey] === forKeyValue)
        return relatedRecord[value_from_field];
    }

    /**
     *
     * @param {String} filePath
     * @return json format data
     */
    jsonResolver(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            new Promise(() => { throw new Error('Error on jsonResolver()'); });
        }
    }
}

module.exports = DataHandler;


