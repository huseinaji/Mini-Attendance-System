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

Perintah ini akan:

* Membangun image untuk API, Worker, dan Frontend
* Menjalankan PostgreSQL dan Redis
* Memulai semua container dalam 1 network `appnet`

### 2. Akses aplikasi

| Service                  | URL                                            |
| ------------------------ | ---------------------------------------------- |
| React Frontend           | [http://localhost:8001](http://localhost:8001) |
| NestJS API               | [http://localhost:8000](http://localhost:8000) |

---



### Worker (Go)

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

  * `/auth/login`
  * `/attendance/checkin`
  * `/attendance/checkout`
  * `/attendance/status-today`

### Go Worker

* Mengkonsumsi Redis Streams `attendance_stream`
* Memproses event menjadi summary harian
* Menjalankan logic tambahan: keterlambatan, shift, overtime

### React Frontend

* Dashboard absensi
* Real-time status check-in/checkout
* Rekap hari ini

---

## 🔄 Alur Sistem

1. User melakukan **check-in** melalui frontend → API mencatat ke Postgres → mem-publish event ke Redis Streams.
2. Worker (Golang) membaca event → memproses → update summary.
3. User melihat status kehadiran realtime dari React.

---

## 🧪 Pengembangan

Untuk development cepat tanpa rebuild Docker image:

### Jalankan NestJS secara lokal

```
cd mini-attendance-api
npm run start:dev
```

### Jalankan Worker secara lokal

```
cd mini-attendance-worker
go run main.go
```

### Frontend React

```
cd web-frontend
npm run dev
```

Pastikan **Redis dan PostgreSQL tetap dari Docker**.

---

## 📝 Catatan Penting

* Gunakan `redis` dan `postgres` sebagai host dalam Docker, **jangan pakai localhost**.
* Worker dan API berjalan dalam network yang sama (`appnet`).
* Struktur event Redis harus konsisten dengan worker.

---

## 📌 Todo

* [ ] Tambah proteksi double check-in/check-out
* [ ] Tambah JWT Auth proper
* [ ] Tambah summary mingguan/bulanan
* [ ] Tambah WebSocket untuk update realtime

---

## 👨‍💻 Author

Husein Aji Pratama

Terima kasih sudah menggunakan project ini! Jika butuh update atau revisi, silakan minta 😊
