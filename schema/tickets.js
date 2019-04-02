module.exports = [
  {
    'relation'         : 'belongs_to', // 'belongs_to' or 'has_many'
    'entity'           : 'users',
    'foreign_key_name' : 'submitter_id',
    'joined_name'      : 'submitter',
    'value_from_field' : 'name'
  },
  {
    'relation'         : 'belongs_to', // 'belongs_to' or 'has_many'
    'entity'           : 'users',
    'foreign_key_name' : 'assignee_id',
    'joined_name'      : 'assignee',
    'value_from_field' : 'name'
  },
  {
    'relation'         : 'belongs_to', // 'belongs_to' or 'has_many'
    'entity'           : 'users',
    'foreign_key_name' : 'organization_id',
    'joined_name'      : 'organization',
    'value_from_field' : 'name'
  },
];