module.exports = [
  {
    'entity'           : 'users',
    'toEntity'         : 'organizations',
    'foreign_key_name' : 'organization_id',
  },
  {
    'entity'           : 'tickets',
    'toEntity'         : 'users',
    'foreign_key_name' : 'submitter_id',
  },
  {
    'entity'           : 'tickets',
    'toEntity'         : 'users',
    'foreign_key_name' : 'assignee_id',
  },
  {
    'entity'           : 'tickets',
    'toEntity'         : 'organizations',
    'foreign_key_name' : 'organization_id',
  },
]