module.exports = [
  {
    'relation'         : 'has_many', // 'belongs_to' or 'has_many'
    'entity'           : 'users',
    'foreign_key_name' : '_id',
    'joined_name'      : 'users',
    'value_from_field' : 'name'
  },
  {
    'relation'         : 'has_many', // 'belongs_to' or 'has_many'
    'entity'           : 'tickets',
    'foreign_key_name' : '_id',
    'joined_name'      : 'tickets',
    'value_from_field' : 'subject'
  },
];