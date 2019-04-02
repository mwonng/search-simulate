module.exports = [
  {
    'entity': 'users',
    'entity_field': 'name',
    'toEntity': 'organizations',
    'toEntity_field': 'name',
    'foreign_key_name': 'organization_id',
    'field_on_entity': 'users_organization',
    'field_on_toEntity': 'organization_users'
  },
  {
    'entity': 'tickets',
    'entity_field': 'subject',
    'toEntity': 'users',
    'toEntity_field': 'name',
    'foreign_key_name': 'submitter_id',
    'field_on_entity': 'submitter_name',
    'field_on_toEntity': 'tickets_as_submitter'
  },
  {
    'entity': 'tickets',
    'entity_field': 'subject',
    'toEntity': 'users',
    'toEntity_field': 'name',
    'foreign_key_name': 'assignee_id',
    'field_on_entity': 'assignee_name',
    'field_on_toEntity': 'tickets_as_assignee'
  },
  {
    'entity': 'tickets',
    'entity_field': 'subject',
    'toEntity': 'organizations',
    'toEntity_field': 'name',
    'foreign_key_name': 'organization_id',
    'field_on_entity': 'ticket_organization',
    'field_on_toEntity': 'organization_tickets'
  },
];