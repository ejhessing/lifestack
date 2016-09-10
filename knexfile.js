// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'lifestack',
      user:     'eda',
      password: ''
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'ec2-54-221-244-190.compute-1.amazonaws.com',
      port: '5432',
      database: 'd9iaqgck1hvbn0',
      user:     'jxneulefelgowq',
      password: process.env.DBPWD
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
