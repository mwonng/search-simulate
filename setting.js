const PROJECT_FOLDER = process.cwd();

const DATA_TYPE = 'json';
const RES_TYPE = 'local';   // 'local' or 'remote'
// const RES_TYPE = 'remote';   // 'local' or 'remote'
const DATA_FOLDER = `${PROJECT_FOLDER}/datasource`;
const SCHEMA_FOLDER = `${PROJECT_FOLDER}/schema`;

const REMOTE_END_POINT = "https://express-routing-example-dxroangojb.now.sh";
const FETCH_ENTITIES = `${REMOTE_END_POINT}/entities/`;
const SEARCH_RESULT_PER_PAGE = 5;   // default as 5 for result showing per page;

module.exports = {
  DATA_FOLDER: DATA_FOLDER,
  PROJECT_FOLDER: PROJECT_FOLDER,
  DATA_TYPE: DATA_TYPE,
  RES_TYPE: RES_TYPE,
  REMOTE_END_POINT: REMOTE_END_POINT,
  FETCH_ENTITIES: FETCH_ENTITIES,
  SEARCH_RESULT_PER_PAGE: SEARCH_RESULT_PER_PAGE,
  SCHEMA_FOLDER: SCHEMA_FOLDER
}