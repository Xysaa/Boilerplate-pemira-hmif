# E-Vote ITERA
### Sistem Pemilihan Elektronik — Himpunan Mahasiswa Informatika ITERA

## Quick Start
```bash
cp .env.example .env
composer install && npm install
php artisan key:generate
# Edit .env: DB, Google OAuth, Turnstile
php artisan migrate --seed
php artisan storage:link
composer run dev
```

## Default Credentials
| Role    | Email                | Password |
|---------|----------------------|----------|
| Admin   | admin@itera.ac.id    | password |
| Petugas | petugas@itera.ac.id  | password |
| Voter   | Google OAuth (@student.itera.ac.id Informatika) |

## Anonimitas Vote
- ballot_boxes: TIDAK ada user_id (hanya session_id + candidate_id)
- participations: mencatat WHO voted, bukan UNTUK SIAPA
- Dua tabel terpisah = tidak bisa di-join untuk ungkap pilihan

Lihat README lengkap di docs/FULL_README.md
