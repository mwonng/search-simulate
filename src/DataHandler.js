var SETTING = require('../setting');
const axios = require('axios');
const fs = require('fs');

class DataHandler {

    static isDataReady(folderPath) {
        if (!fs.existsSync(folderPath)) return false;
        if (fs.readdirSync(folderPath).length <= 1) return false;
        return true;
    }

    static getAllLocalEntities(folderPath) {
        return fs.readdirSync(folderPath);
    }

    /**
     * If you are going to set a fetch result, change this method
     * @param {String} endpoint
     */
    static async getAllRemoteEntities(endpoint) {
        let res = await axios.get(endpoint)
        let entities = res.data;   // change this to match ur remote date
        return entities;
    }

    /**
     * getEntityFields() get all available fields in entity among all records in entity
     * @param   {String}  entityPath
     * @return  {Set}     attributes set
     */
    static getLocalEntityFields(entityPath) {
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
    static async getRemoteEntityFields(endpoint) {
        let res = await axios.get(endpoint)
        let fieldsArray = res.data;  // change this to match ur remote dat        let attr = new Set();
        let attr = new Set();
        fieldsArray.forEach(record => {
            attr = new Set([...attr, ...Object.keys(record)]);
        })
        return attr;
    }

    static formatedEntitiesName(namesArray) {
        return namesArray.map(fullName =>
            this.capitalize(fullName.split('.')[0])
        )
    }

    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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


