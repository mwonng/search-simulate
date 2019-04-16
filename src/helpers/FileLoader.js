const fs = require('fs');
const SETTING = require('../../setting');
const func = require('../utils/func');

class FileLoader {

    static isDataReady(folderPath) {
        if (!fs.existsSync(folderPath)) return false;
        if (fs.readdirSync(folderPath).length <= 1) return false;
        return true;
    }

    static loadingAllEntities(folderPath) {
        if (!this.isDataReady(folderPath)) {
            throw new Error("Error: getAllLocalEntities() cannot get entities from folder");
        }
        return fs.readdirSync(folderPath);
    }

    static loadingJsonEntity(entity) {
        let data = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        return data;
    }

    static loadingSchema() {
        let data = require(`${SETTING.SCHEMA_FOLDER}/schema`);
        return data;
    }

    static loadingAllEntityFields() {
        let entitiesList = func.formateEntitiesName(this.loadingAllEntities(SETTING.DATA_FOLDER));
        let allEntityFieldsCache = {};
        entitiesList.forEach( entity => {
            allEntityFieldsCache[entity] = this.loadingFieldsFromEntity(entity);
        });

        return allEntityFieldsCache;
    }

    /**
     * getEntityFields() get all available fields in entity among all records in entity
     * @param   {String}  entityPath
     * @return  {Set}     attributes set
     */
    static loadingFieldsFromEntity(entity) {
        const data = this.loadingJsonEntity(entity);
        let attr = new Set();
        for ( let i = 0, len = data.length; i < len; i++) {
            attr = new Set([...attr, ...Object.keys(data[i])]);
        }
        return attr;
    }

    static generateEntityIndex(entity, via_field, pkey="_id") {
        let data  = this.loadingJsonEntity(entity);
        let index = {};
        data.forEach(el => {
            let key   = el[pkey];
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
    static generateAllIndex() {
        let schema = this.loadingSchema();
        let index  = {};

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

    /**
     * convert entity from Array to Object with 'id' as key
     */
    static loadingMappedEntity() {
        let entitiesList = func.formateEntitiesName(this.loadingAllEntities(SETTING.DATA_FOLDER));
        let result       = {};

        entitiesList.forEach( entity => {
            let entityData= require(`${SETTING.DATA_FOLDER}/${entity}.json`);
            let entityObj = func.arrayMapToObject(entityData, '_id');
            result[entity] = entityObj;
        });

        return result;
    }
}

module.exports = FileLoader;