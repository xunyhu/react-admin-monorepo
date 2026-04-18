Place your MySQL initialization SQL files here, for example `init.sql`.

When `docker compose up` runs for the first time, MySQL will execute `*.sql`,
`*.sql.gz`, and `*.sh` files in this directory automatically.

If the database volume already exists, remove `docker/mysql/data` before
recreating the containers if you want the init scripts to run again.
