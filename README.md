### NestJS Boilerplate for REST API Server App

- [Swagger docs](https://playground-c2ooxzo2ra-uc.a.run.app/doc) for APIs
- CRUD endpoints
- TypeORM (Data access layer)
    - Database migrations
- JWT token authentication (Register, log in, reset password)
- GitHub actions to run tests before PR
- TestContainers library for e2e and integration tests
    - Provide virtual PostgreSQL environment
    - Install Docker Desktop before running tests
- Winston logs
- Custom exceptions
- [Temporal IO](https://temporal.io) server
    - To run temporal locally, `temporal server start-dev`
