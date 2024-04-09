#!/bin/bash

# Prompt the user for the migration name
echo "Enter the name for the new migration:"
read migrationName

# Generate the migration using the provided name
cross-env NODE_ENV=local npx typeorm migration:create ./src/database-migrations/"$migrationName"