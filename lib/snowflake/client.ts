import "server-only";

import snowflake, {
  type Binds,
  type Connection,
} from "snowflake-sdk";

type SnowflakeEnvName =
  | "SNOWFLAKE_ACCOUNT"
  | "SNOWFLAKE_USERNAME"
  | "SNOWFLAKE_TOKEN"
  | "SNOWFLAKE_WAREHOUSE"
  | "SNOWFLAKE_DATABASE"
  | "SNOWFLAKE_SCHEMA"
  | "SNOWFLAKE_ROLE";

function getEnv(name: SnowflakeEnvName): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createConnection(): Connection {
  return snowflake.createConnection({
    account: getEnv("SNOWFLAKE_ACCOUNT"),
    username: getEnv("SNOWFLAKE_USERNAME"),
    authenticator: "PROGRAMMATIC_ACCESS_TOKEN",
    token: getEnv("SNOWFLAKE_TOKEN"),
    warehouse: getEnv("SNOWFLAKE_WAREHOUSE"),
    database: getEnv("SNOWFLAKE_DATABASE"),
    schema: getEnv("SNOWFLAKE_SCHEMA"),
    role: getEnv("SNOWFLAKE_ROLE"),
    application: "ECHO",
  });
}

function connect(connection: Connection): Promise<Connection> {
  return new Promise((resolve, reject) => {
    connection.connect((error, connectedConnection) => {
      if (error) {
        reject(
          new Error(`Unable to connect to Snowflake: ${error.message}`),
        );
        return;
      }

      resolve(connectedConnection);
    });
  });
}

export async function executeQuery<T extends object>(sqlText: string, binds?: Binds,): Promise<T[]> {
  const connection = createConnection();
  const connected = await connect(connection);

  try {
    return await new Promise<T[]>((resolve, reject) => {
      connected.execute({
        sqlText,
        ...(binds ? { binds } : {}),
        complete(error, _statement, rows) {
          if (error) {
            reject(
              new Error(`Snowflake query failed: ${error.message}`),
            );
            return;
          }

          resolve((rows ?? []) as T[]);
        },
      });
    });
  } finally {
    connected.destroy((error) => {
      if (error) {
        console.error(
          "Failed to close Snowflake connection:",
          error.message,
        );
      }
    });
  }
}