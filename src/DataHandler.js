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
        let entitySchema = require(`${SETTING.SCHEMA_FOLDER}/${entity}`);
    }

    getOneBelongsToData(record, entity, forKey, joined_name, value_from_field, pkey='_id') {
        let belongsToEntity = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let relatedRecord = belongsToEntity.find((el)=> el[pkey] === record[forKey]);

        if (Array.isArray(value_from_field)) {
            value_from_field.forEach( element => {
                let key_name = `${joined_name}_${element}`;
                record[key_name] = relatedRecord[element];
            })
        } else {
            record[joined_name] = relatedRecord[value_from_field];
        }
        return record;
    }

    getOneHasManyToData(record, entity, forKey, joined_name, value_from_field, pkey='_id') {
        let hasManyEntity = require(`${SETTING.DATA_FOLDER}/${entity}.json`);
        let relatedRecord = hasManyEntity.filter(el => el[forKey] === record[pkey]);
        let result = relatedRecord.map( el => el[value_from_field]);
        record[joined_name] = result;
        return record;
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
}

module.exports = DataHandler;


