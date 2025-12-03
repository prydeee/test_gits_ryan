# Katalog Buku – Digital Book Catalog Platform
**Fullstack Technical Test** 

Demo Aplikasi:

https://drive.google.com/drive/folders/17V_vp39ZNcldTnq2rZlrbRiJeOO3F7DZ?usp=sharing

Laravel 11 API + PostgreSQL + Next.js 14 (App Router) + Shadcn UI + **Swagger Documentation**

## Tech Stack
| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Laravel 11, Sanctum, PostgreSQL     |
| API Docs    | **Swagger UI** (live di /api/documentation) |
| Frontend    | Next.js 14, TypeScript, Tailwind, Shadcn UI |
| Auth        | JWT + Zustand state                 |
| HTTP Client | Axios + Interceptor                 |

## Project Structure
katalog_buku/
├── backend/     → Laravel API + Swagger Docs
├── frontend/    → Next.js Admin Dashboard
└── README.md    → You're here

## Quick Start

### Backend (Laravel + Swagger)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Edit .env (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=katalog_buku
DB_USERNAME=postgres
DB_PASSWORD=your_password

php artisan migrate --seed
php artisan l5-swagger:generate   # Generate Swagger JSON
php artisan serve
API berjalan di: http://localhost:8000
Swagger Documentation: http://localhost:8000/api/documentation

Frontend (Next.js)

cd frontend
cp .env.local.example
# Isi:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

npm install
npm run dev
Dashboard: http://localhost:3000
Default Login

Email: ryansyah@admin.com
Password: password