/**
 * Load parameter from envvar if specified, or throw an exception otherwise.
 * @param paramName - The name of the parameter to source from env vars (e.g.
 * "BACKEND_CONFIG_PARAM")
 * @param defaultParam - The default value to return if the env var is not
 */
const loadParam = (paramName: string, defaultParam?: any): string => {
  const paramValue = process.env[paramName];
  if (paramValue === undefined && defaultParam === undefined) {
    throw new Error(`Required env var ${paramName} not set.`);
  }
  return paramValue || defaultParam;
};

export default () => ({
  NODE_ENV: process.env.NODE_ENV || "local",
  PORT: parseInt(loadParam("PORT", 7778), 10),

  JWT_SECRET: loadParam("JWT_SECRET"),
});
