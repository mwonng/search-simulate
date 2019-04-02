const SETTING = require('../setting');
const fs = require('fs');
const func = require('./utils/func');

class DataHandler {
    constructor() {
        this.index = this.generateAllIndex();
    }

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
        // let relatedAttr = this.getJoinedFields(entity);
        // let joinedAttr = new Set([...attr, ...relatedAttr]);

        return attr;
    }

    // getJoinedFields(entity) {
    //     var schema = require(`${SETTING.SCHEMA_FOLDER}/${entity}`);
    //     let fields = schema.map(setting => setting.joined_name);
    //     return new Set(fields);
    // }

    mergedWithRelatedEntity(el, entity) {
        let entitySchema = require(`${SETTING.SCHEMA_FOLDER}/schema`);
        let belongsTo = entitySchema.filter( schema => schema.entity === entity);
        let hasMany = entitySchema.filter( schema => schema.toEntity === entity);
        let extrabelongsToInfo, hasManyToInfo, joinedRecord = {};

        belongsTo.forEach( schemaSetting => {
            extrabelongsToInfo = {...extrabelongsToInfo, ...this.getOneBelongsToData(el, schemaSetting)};
        })

        hasMany.forEach( schemaSetting => {
            hasManyToInfo = {...hasManyToInfo, ...this.getOneHasManyToData(el, schemaSetting)};
        })

        // TODO: has many action

        joinedRecord = {...el, ...extrabelongsToInfo, ...hasManyToInfo};
        return joinedRecord;
    }

    getOneBelongsToData(record, schemaSetting, pkey='_id') {
        let index = this.index;
        let { entity, toEntity, foreign_key_name, field_on_entity, toEntity_field } = schemaSetting;
        let currentIndex = index[entity][`${foreign_key_name}_${toEntity}`]
        let currentRecordIndexValue = currentIndex[record._id];
        let extraInfo = {}

        // if no forien key
        if (currentRecordIndexValue === undefined) {
            return extraInfo;
        }

        let belongsToEntity = require(`${SETTING.DATA_FOLDER}/${toEntity}.json`);
        let belongsToEntityObj = this.arrayToObject(belongsToEntity, "_id"); // TODO: put to another position?
        let relatedRecord = belongsToEntityObj[currentRecordIndexValue];
        // console.log(relatedRecord);
        extraInfo[field_on_entity] = relatedRecord[toEntity_field];
        return extraInfo;
    }

    getOneHasManyToData(record, schemaSetting, pkey='_id') {
        let index = this.index;
        let { entity, toEntity, foreign_key_name, field_on_toEntity, entity_field } = schemaSetting;
        let currentIndex = index[toEntity][`${foreign_key_name}_${entity}`]
        let currentRecordIndexValues = currentIndex[record._id];    // a set
        let extraInfo = {}

        // if no forien key
        if (currentRecordIndexValues === undefined) {
            return extraInfo;
        }

        let hasManyEntity = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let hasManyEntityObj = this.arrayToObject(hasManyEntity, "_id"); // TODO: put to another position?
        let relatedRecords = [];
        currentRecordIndexValues.forEach( elem => {
            relatedRecords = [...relatedRecords, hasManyEntityObj[elem][entity_field]];
        });
        extraInfo[field_on_toEntity] = relatedRecords
        return extraInfo;
    }

    generateEntityIndex(entity, to_entity, via_field) {
        let index = {};
        let data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        data.forEach(el => {
            let key = el._id;
            let value = el[via_field];
            if (value) {
                index[key] = value;
            }
        })
        return index;
    }

    generateAllIndex() {
        let schema = require(`${SETTING.SCHEMA_FOLDER}/schema`);

        let index = {};
        schema.forEach( s => {
            if (index[s.entity] === undefined) index[s.entity] = {};
            if (index[s.toEntity] === undefined ) index[s.toEntity] = {};

            let ascIndex = this.generateEntityIndex(s.entity, s.toEntity, s.foreign_key_name);

            // add index and reversed index
            index[s.entity][`${s.foreign_key_name}_${s.toEntity}`] = ascIndex;
            index[s.toEntity][`${s.foreign_key_name}_${s.entity}`] = func.reverseMap(ascIndex);
        })
        return index;
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

    arrayToObject(array, object_key) {
        let result = {}
        array.forEach(el => {
            let key = el[object_key];
            result[key] = el;
        })

        return result
    }
}

module.exports = DataHandler;


