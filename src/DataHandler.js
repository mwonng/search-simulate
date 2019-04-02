const SETTING = require('../setting');
const fs = require('fs');
const func = require('./utils/func');

class DataHandler {
    constructor() {
        this.schema = require(`${SETTING.SCHEMA_FOLDER}/schema`);
        this.index = this.generateAllIndex();
        this.mappedData = this.loadingMappedEntity();
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
        const data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let attr = new Set();
        for ( let i = 0, len = data.length; i < len; i++) {
            attr = new Set([...attr, ...Object.keys(data[i])]);
        }

        return attr;
    }

    prepareRelatedData(res, entityOfRes) {
        return res.map( record => this.mergedWithRelatedEntity(record, entityOfRes));
    }

    mergedWithRelatedEntity(el, entity) {
        let belongsTo = this.schema.filter( schema => schema.entity === entity);
        let hasMany = this.schema.filter( schema => schema.toEntity === entity);
        let extrabelongsToInfo, hasManyToInfo, joinedRecord = {};

        belongsTo.forEach( schemaSetting => {
            extrabelongsToInfo = {...extrabelongsToInfo, ...this.getOneBelongsToData(el, schemaSetting)};
        });

        hasMany.forEach( schemaSetting => {
            hasManyToInfo = {...hasManyToInfo, ...this.getOneHasManyToData(el, schemaSetting)};
        });

        joinedRecord = {...el, ...extrabelongsToInfo, ...hasManyToInfo};
        return joinedRecord;
    }

    /**
     * loading belongs to entity info via schema
     * @param {Object} record
     * @param {Array} schemaSetting
     * @param {String} pkey
     * @return {Object} extra infor as a object
     */
    getOneBelongsToData(record, schemaSetting, pkey='_id') {
        let { entity, toEntity, foreign_key_name, field_on_entity, toEntity_field } = schemaSetting;
        let currentIndex = this.index[entity][`${foreign_key_name}_${toEntity}`];
        let currentRecordIndexValue = currentIndex[record[pkey]];
        let extraInfo = {};

        // if no forien key
        if (currentRecordIndexValue === undefined) {
            return extraInfo;
        }

        let belongsToEntityObj = this.mappedData[toEntity];

        let relatedRecord = belongsToEntityObj[currentRecordIndexValue];

        // if foreign key has no matched
        if (relatedRecord === undefined) {
            return extraInfo;
        }

        extraInfo[field_on_entity] = relatedRecord[toEntity_field];
        return extraInfo;
    }

    /**
     * loading has many entity info via schema
     * @param {Object} record
     * @param {Array} schemaSetting
     * @param {String} pkey
     * @return {Object} extra infor as a object
     */
    getOneHasManyToData(record, schemaSetting, pkey='_id') {
        let { entity, toEntity, foreign_key_name, field_on_toEntity, entity_field } = schemaSetting;
        let currentIndex = this.index[toEntity][`${foreign_key_name}_${entity}`];
        let currentRecordIndexValues = currentIndex[record[pkey]];    // a set
        let extraInfo = {};

        // if no forien key
        if (currentRecordIndexValues === undefined) {
            return extraInfo;
        }

        let hasManyEntityObj = this.mappedData[entity];
        let relatedRecords = [];
        currentRecordIndexValues.forEach( elem => {
            relatedRecords = [...relatedRecords, hasManyEntityObj[elem][entity_field]];
        });
        extraInfo[field_on_toEntity] = relatedRecords;
        return extraInfo;
    }

    generateEntityIndex(entity, via_field) {
        let index = {};
        let data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        data.forEach(el => {
            let key = el._id;
            let value = el[via_field];
            if (value) {
                index[key] = value;
            }
        });
        return index;
    }

    /**
     * generate index from schema.
     */
    generateAllIndex() {
        let schema = this.schema;
        let index = {};

        schema.forEach( s => {
            if (index[s.entity] === undefined) index[s.entity] = {};
            if (index[s.toEntity] === undefined ) index[s.toEntity] = {};

            let ascIndex = this.generateEntityIndex(s.entity, s.foreign_key_name);

            // add index and reversed index
            index[s.entity][`${s.foreign_key_name}_${s.toEntity}`] = ascIndex;
            index[s.toEntity][`${s.foreign_key_name}_${s.entity}`] = func.reverseMap(ascIndex);
        });
        return index;
    }

    loadingMappedEntity() {
        let result = {};
        let entitiesList = func.formateEntitiesName(this.loadingEntitiesList());

        entitiesList.forEach( entity => {
            let entityData= require(`${SETTING.DATA_FOLDER}/${entity}.json`);
            let entityObj = func.arrayMapToObject(entityData, '_id');
            result[entity] = entityObj;
        });

        return result;
    }
}

module.exports = DataHandler;


