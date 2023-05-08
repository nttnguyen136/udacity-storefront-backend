# Storefront Backend Project

## Project Summary 
Build a JavaScript API based on a requirements given by the stakeholders.

[REQUIREMENTS.md](REQUIREMENTS.md) document which outlines what this API supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend.

## Installation Instructions

To install dependencies run command from CLI

`yarn` or `npm install`

### Project Dependencies
- [Express](https://www.npmjs.com/package/express)
- [Jasmine](https://www.npmjs.com/package/jasmine)
- [Supertest](https://www.npmjs.com/package/supertest)
- [pg](https://www.npmjs.com/package/pg)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [db-migrate](https://www.npmjs.com/package/db-migrate)
- [db-migrate-pg](https://www.npmjs.com/package/db-migrate-pg)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cross-env](https://www.npmjs.com/package/cross-env)



### Environment Set up
Create `.env` file in root and copy below config into it:

```
POSTGRES_HOST=localhost
POSTGRES_DB=storefont_db
POSTGRES_USER=storefont_admin
POSTGRES_PASSWORD=storefont123
DB_PORT=5433

BCRYPT_PASSWORD=storefont
SALT_ROUNDS=10
TOKEN_SECRET=23p21j3g

POSTGRES_DB_TEST=storefont_db_test
POSTGRES_USER_TEST=storefont_test
POSTGRES_PASSWORD_TEST=storefont123_test

```
### Database set up

```bash
# Start docker with docker compose with config ./docker-compose.yml
docker compose up -d

# Migrate data
yarn db-up
```

### Start development server
```bash
yarn watch
```
Backend PORT `3000`
Database port `5433`


Endpoint can be found at [REQUIREMENTS.md](REQUIREMENTS.md)

## Test

### Test Environment Set up
1. Create `test.env` file with config below:

```
POSTGRES_HOST=localhost
POSTGRES_DB=storefont_db_test
POSTGRES_USER=storefont_test
POSTGRES_PASSWORD=storefont123_test
DB_PORT=5433
```

2. Start docker compose with test config:
```bash
docker compose --env-file ./test.env -f docker-compose.test.yml up -d
```

3. Run test with:
```bash
yarn test
```

** NOTE: I have an issue with the config of among environments. Please stop the development container before starting the test container. Run the command `docker compose down`

## TEST RESULT

![test_result](https://github.com/nttnguyen136/postgresql-and-express-storefront/blob/master/test-result.png?raw=true)


