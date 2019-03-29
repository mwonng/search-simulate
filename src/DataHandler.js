var SETTING = require('../setting');
const fs = require('fs');

class DataHandler {

  static checkData() {
    return DataHandler.getAllEntities().length ? true : false;
  }

  /**
   * getAllEntities() use sync
   *
   */
  static getAllEntities() {
    return fs.readdirSync(SETTING.DATA_FOLDER);
  }

  static getEntityFields(entity) {

  }


  /**
   * @return {Array}
   */
  static formatedEntitiesData() {
    if (DataHandler.checkData()) {
      return DataHandler.getAllEntities().map(fullName => {
        return {
          'name': fullName.split('.')[0],
          'ext': fullName.split('.')[1]
        };
      })
    }
    return [];
  }

  static formatedEntitiesName() {
    if (DataHandler.checkData()) {
      return DataHandler.getAllEntities().map(fullName => this.capitalize(fullName.split('.')[0]))
    }
    return [];
  }

  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   *
   * @param {*} filePath
   * @return json format data
   */
  static jsonResolver(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
}

module.exports = DataHandler;


