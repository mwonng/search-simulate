var fs = require('fs');
var SETTING = require('../setting');
var DataHandler = require('./DataHandler');


class Search {
  find(entity, field, keyword) {
    // check entity extension

    // import data
    var data = DataHandler.jsonResolver(`${SETTING.DATA_FOLDER}/${entity}.json`);

    // get result
    let res = data.filter( record => {
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

  output(results) {
    let count = results.length;
    console.log(count);
    if (count) {
      results.forEach((record,index) => {
        console.log(`------${index+1}/${count}-------`);
        Object.keys(record).forEach( key => {
          let line = key.padEnd(30) + record[key].toString().padEnd(50);
          console.log(line)
        })
      })
    } else {
      console.log("No record founded")
    }
  }

}


module.exports = Search;