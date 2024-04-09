### NestJS Boilerplate for REST API Server App

- Basic CRUD endpoints
- TypeORM (Data access layer)
    - Database migrations
- JWT token authentication (Register, log in, reset password)
- Swagger docs for APIs
    - Run localhost and go to /doc for Swagger documentation
- GitHub actions to run tests before PR
- TestContainers library for e2e and integration tests
    - Provide virtual PostgreSQL environment
    - Install Docker Desktop before running tests
- Winston logs
- Custom exceptions
- Temporal IO server (temporal.io)
    - To run temporal locally, `temporal server start-dev`
