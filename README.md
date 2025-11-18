# Mini Attendance System

Sistem attendance lengkap menggunakan **NestJS API**, **Go Worker**, dan **React Frontend** dengan orkestrasi menggunakan **Docker Compose**.

Project ini terdiri dari 3 service utama:

1. **API (NestJS)** – menangani REST API, autentikasi, attendance check-in/check-out, dan integrasi Redis Streams.
2. **Worker (Golang)** – memproses event asynchronous dari Redis Streams (misalnya generate attendance summary, logging, processing lateness/leave rule).
3. **Frontend (React)** – antarmuka user untuk absensi harian, melihat status kehadiran, riwayat, dan live update.

---

## 📦 Struktur Project

```
root
│
├── mini-attendance-api        # NestJS backend API
├── mini-attendance-worker     # Golang async worker
├── web-frontend               # React web client
└── docker-compose.yml         # Orkestrasi seluruh service
```

---

## 🚀 Cara Menjalankan Project


### 1. Jalankan semua service

```
docker compose up --build
```

### 2. Akses aplikasi

| Service                  | URL                                            |
| ------------------------ | ---------------------------------------------- |
| React Frontend           | [http://localhost:8001](http://localhost:8001) |
| NestJS API               | [http://localhost:8000](http://localhost:8000) |

---

### Environment Worker (Go)

```
POSTGRE_URL=postgres://postgres:root@postgres:5432/attendance?sslmode=disable
REDIS_URL=redis:6379
```

---

## 🐳 Docker Compose

Project ini menggunakan komponen berikut:

### PostgreSQL

* Database utama
* Menyimpan data attendance, user, dan summary

### Redis Stack Server

* Menyimpan event stream untuk asynchronus worker

### NestJS API

* Menyediakan endpoint seperti:

  * `/api/auth/signup` *daftar user/employee baru*
  * `/api/auth/login` *login user/employee*
  * `/api/auth/profile` *cek user yang login sekarang*
  * `/api/user` *cek semua user terdaftar*
  * `/api/attendance/checkin` *checkin api*
  * `/api/attendance/checkout` *checkout api*
  * `/api/attendace-summary` *report attendance*

### Go Worker

* Mengkonsumsi Redis Streams `attendance_stream`
* Memproses event menjadi summary harian dan mencatat attendance
* Menjalankan logic tambahan: present, late, early_leave

### React Frontend

* Dashboard absensi
* Real-time status check-in/checkout
* Rekap data

---

## 🔄 Alur Sistem

1. User login (User dianggap employee) untuk mendapatkan access_token
2. User melakukan **check-in** melalui frontend → API mencatat mem-publish event ke Redis Streams.
3. Worker (Golang) membaca event → memproses →  simpan data checkin → update summary.
4. User melihat status kehadiran realtime dari React.

---

### Jalankan NestJS secara lokal

```
cd mini-attendance-api
npm run start:dev
```

### Jalankan Worker secara lokal

```
cd mini-attendance-worker
go run .
```

### Frontend React

```
cd web-frontend
npm run dev
```

---

## 📝 Catatan Penting

* Gunakan `redis` dan `postgres` sebagai host dalam Docker, **jangan pakai localhost**.
* Worker dan API berjalan dalam network yang sama (`appnet`).
* Struktur event Redis harus konsisten dengan worker.

---

## 📌 Todo

* [ ] Integrasi frontend
* [ ] Unit testing backend
* [ ] Tambah WebSocket untuk update realtime ke frontend
* [ ] Tambah cache system
* [ ] Manage Environtment 

---

## 👨‍💻 Author

Husein Aji Pratama

