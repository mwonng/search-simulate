var SETTING = require('../setting');
const axios = require('axios');
const fs = require('fs');

class DataHandler {
    isDataReady(folderPath) {
        if (!fs.existsSync(folderPath)) return false;
        if (fs.readdirSync(folderPath).length <= 1) return false;
        return true;
    }

    async loadingEntitiesList() {
        return SETTING.RES_TYPE === 'remote' ?
            await this.getAllRemoteEntities(SETTING.FETCH_ENTITIES) :
            this.getAllLocalEntities(SETTING.DATA_FOLDER);
    }

    async loadingFields(entity) {
        return SETTING.RES_TYPE === 'remote' ?
            await this.getRemoteEntityFields(`${SETTING.REMOTE_END_POINT}/${entity}`) :
            this.getLocalEntityFields(`${SETTING.DATA_FOLDER}/${entity}.json`);
    }

    getAllLocalEntities(folderPath) {
        return fs.readdirSync(folderPath);
    }

    /**
     * If you are going to set a fetch result, change this method
     * @param {String} endpoint
     */
    async getAllRemoteEntities(endpoint) {
        let res = await axios.get(endpoint)
        let entities = res.data;   // change this to match ur remote date
        return entities;
    }

    /**
     * getEntityFields() get all available fields in entity among all records in entity
     * @param   {String}  entityPath
     * @return  {Set}     attributes set
     */
    getLocalEntityFields(entityPath) {
        const data = DataHandler.jsonResolver(entityPath);
        let attr = new Set();
        data.forEach(record => {
            attr = new Set([...attr, ...Object.keys(record)]);
        })
        return attr;
    }

    /**
     * This method for fetch fields from server
     * @param {String} endpoint
     */
    async getRemoteEntityFields(endpoint) {
        let res = await axios.get(endpoint)
        let fieldsArray = res.data;  // change this to match ur remote dat        let attr = new Set();
        let attr = new Set();
        fieldsArray.forEach(record => {
            attr = new Set([...attr, ...Object.keys(record)]);
        })
        return attr;
    }

    /**
     *
     * @param {String} filePath
     * @return json format data
     */
    static jsonResolver(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            new Promise(() => { throw new Error('Error on jsonResolver()'); });
        }
    }
}

module.exports = DataHandler;


