
```markdown
# Backend API – Laravel 11 + PostgreSQL + Swagger

## Setup
```bash
composer install
cp .env.example .env
php artisan key:generate

# Edit .env → PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=katalog_buku
DB_USERNAME=postgres
DB_PASSWORD=

php artisan migrate --seed
php artisan l5-swagger:generate
php artisan serve