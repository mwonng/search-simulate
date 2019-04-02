const PROJECT_FOLDER = process.cwd();

const DATA_TYPE = 'json';
const DATA_FOLDER = `${PROJECT_FOLDER}/datasource`;
const SCHEMA_FOLDER = `${PROJECT_FOLDER}/schema`;
const SEARCH_RESULT_PER_PAGE = 5;   // default as 5 for result showing per page;

module.exports = {
  DATA_FOLDER: DATA_FOLDER,
  PROJECT_FOLDER: PROJECT_FOLDER,
  DATA_TYPE: DATA_TYPE,
  SEARCH_RESULT_PER_PAGE: SEARCH_RESULT_PER_PAGE,
  SCHEMA_FOLDER: SCHEMA_FOLDER
};