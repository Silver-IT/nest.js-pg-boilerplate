import { ConnectionOptions } from 'typeorm';
import * as PostgressConnectionStringParser from 'pg-connection-string';

const DATABASE_URL_DEV = 'postgres://root:password@localhost:5432/mgzbuilder';

const connectionOptions = PostgressConnectionStringParser.parse(
  process.env.NODE_ENV === 'development'
    ? DATABASE_URL_DEV
    : process.env.DATABASE_URL,
);

// Check typeORM documentation for more information.
const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: connectionOptions.host,
  port: Number(connectionOptions.port),
  username: connectionOptions.user,
  password: connectionOptions.password,
  database: connectionOptions.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = ormConfig;
