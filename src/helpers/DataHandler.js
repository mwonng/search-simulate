const SETTING = require('../../setting');
const File = require('./FileLoader');
class DataHandler {
    constructor() {
        this.schema = File.loadingSchema();
        this.index = File.generateAllIndex();
        this.mappedData = File.loadingMappedEntity();
    }

    loadingEntitiesList() {
        return File.loadingAllEntities(SETTING.DATA_FOLDER);
    }

    loadingFields(entity) {
        return File.loadingFieldsFromEntity(entity);
    }

    prepareRelatedData(res, entityOfRes) {
        return res.map( record => this.mergedWithRelatedEntity(record, entityOfRes));
    }

    mergedWithRelatedEntity(el, entity) {
        let belongsTo = this.schema.filter( schema => schema.entity === entity);
        let hasMany = this.schema.filter( schema => schema.toEntity === entity);
        let extrabelongsToInfo, hasManyToInfo, joinedRecord = {};

        belongsTo.forEach( schemaSetting => {               // generate belongsTo entity's field
            extrabelongsToInfo = {...extrabelongsToInfo, ...this.getOneBelongsToData(el, schemaSetting)};
        });

        hasMany.forEach( schemaSetting => {                 // generate hasMany entity's field
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
        let currentIndex            = this.index[entity][`${foreign_key_name}_${toEntity}`];
        let currentRecordIndexValue = currentIndex[record[pkey]];
        let extraInfo               = {};

        // if no forien key
        if (currentRecordIndexValue === undefined) {
            return extraInfo;
        }

        let belongsToEntityObj = this.mappedData[toEntity];

        let relatedRecord      = belongsToEntityObj[currentRecordIndexValue];

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
        let currentIndex             = this.index[toEntity][`${foreign_key_name}_${entity}`];
        let currentRecordIndexValues = currentIndex[record[pkey]];    // a set
        let extraInfo                = {};

        // if no forien key
        if (currentRecordIndexValues === undefined) {
            return extraInfo;
        }

        let hasManyEntityObj = this.mappedData[entity];
        let relatedRecords   = [];
        currentRecordIndexValues.forEach( elem => {
            relatedRecords = [...relatedRecords, hasManyEntityObj[elem][entity_field]];
        });
        extraInfo[field_on_toEntity] = relatedRecords;
        return extraInfo;
    }
}

module.exports = DataHandler;


