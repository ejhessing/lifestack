exports.up = (knex, Promise) => {
  return knex.schema.createTable('videos', (table) => {
    table.increments('id').primary()
    table.string('skill_id').references('id').inTable('skills').onUpdate('CASCADE').onDelete('CASCADE')
    table.string('url')
    table.integer('votes')
    table.string('type')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('videos')
}
