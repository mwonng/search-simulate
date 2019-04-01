module.exports = [
  {
    'relation'         : 'belongs_to', // 'belongs_to' or 'has_many'
    'entity'           : 'organizations.json',
    'foreign_key_name' : 'organization_id',
    'joined_name'      : 'organization',
    'value_from_field' : 'name'
  },
  {
    'relation'         : 'has_many', // 'belongs_to' or 'has_many'
    'entity'           : 'tickets.json',
    'foreign_key_name' : 'submitter_id',
    'joined_name'      : 'as_submitter',
    'value_from_field' : 'subject'
  },
  {
    'relation'         : 'has_many', // 'belongs_to' or 'has_many'
    'entity'           : 'tickets.json',
    'foreign_key_name' : 'assignee_id',
    'joined_name'      : 'as_assignee',
    'value_from_field' : 'subject'
  }
]