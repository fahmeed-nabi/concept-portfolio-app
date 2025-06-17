# concept-portfolio-app
A full-stack web application for discovering and showcasing creative talent. Users can create public creative profiles with photos, bios, tags, and portfolio links, and browse or search through a directory of creators by name and creative field.

## Local Database Setup Instructions
1. Create a PostgreSQL DB named `concept_portfolio`:
```sql
-- 1. Create the database
CREATE DATABASE concept_portfolio;
```
2. Create a user and grant access:
   ```sql
   CREATE USER concept_dev WITH PASSWORD 'password123';
   GRANT ALL PRIVILEGES ON DATABASE concept_portfolio TO concept_dev;
This matches the information in the `.env` file.

4. Run migrations:
```
python manage.py migrate
```

## Troubleshooting PostgreSQL Permission Denied Error
If you run 'python manage.py migrate' and see django.db.utils.ProgrammingError: permission denied for schema public:
1. Log in to the PostgreSQL CLI as the `postgres' superuser and switch to the project database:
```
psql -U postgres
\c concept_portfolio
```
2. Run these commands to authorize dev user
```sql
ALTER SCHEMA public OWNER TO concept_dev;
GRANT ALL ON SCHEMA public TO concept_dev;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO concept_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO concept_dev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO concept_dev;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO concept_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO concept_dev;
```
3. Try running migrations again
```
python manage.py migrate
```
