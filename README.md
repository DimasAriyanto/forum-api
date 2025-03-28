# Forum API

Proyek ini adalah aplikasi RESTful API untuk platform forum diskusi. API ini mendukung fitur pembuatan topik diskusi, komentar, balasan, serta autentikasi pengguna.

## Fitur Utama
- Autentikasi dan otorisasi menggunakan JWT
- CRUD untuk Threads (Topik Diskusi)
- CRUD untuk Comments (Komentar)
- CRUD untuk Replies (Balasan pada Komentar)
- Validasi data menggunakan Joi
- Pengujian otomatis dengan Jest

## Teknologi yang Digunakan
- **Node.js** + **Express.js**
- **PostgreSQL** (Database)
- **Joi** (Validasi)
- **Jest** (Testing)
- **JWT** (JSON Web Token)

## Instalasi
1. Instal dependensi
```bash
npm install
```

2. Konfigurasi environment
Copy file `.env.development` menjadi `.env`:
```bash
cp .env.development .env
```

3. Jalankan migrasi database
```bash
npm run migrate
```

4. Jalankan server
```bash
npm start
```

## Endpoint API

### Autentikasi
| Method | Endpoint           | Deskripsi            |
|---------|--------------------|-----------------------|
| `POST`   | `/users`            | Daftar pengguna baru  |
| `POST`   | `/authentications`  | Login                 |
| `PUT`    | `/authentications`  | Refresh token         |
| `DELETE` | `/authentications`  | Logout                |

### Threads
| Method | Endpoint        | Deskripsi                |
|---------|-----------------|---------------------------|
| `POST`   | `/threads`        | Buat thread baru           |
| `GET`    | `/threads/:id`    | Ambil detail thread        |
| `DELETE` | `/threads/:id`    | Hapus thread               |

### Comments
| Method | Endpoint                   | Deskripsi                |
|---------|----------------------------|---------------------------|
| `POST`   | `/threads/:id/comments`      | Buat komentar di thread    |
| `DELETE` | `/threads/:id/comments/:id`  | Hapus komentar             |

### Replies
| Method | Endpoint                                  | Deskripsi                |
|---------|---------------------------------------------|---------------------------|
| `POST`   | `/threads/:threadId/comments/:commentId/replies` | Buat balasan pada komentar |
| `DELETE` | `/threads/:threadId/comments/:commentId/replies/:id` | Hapus balasan              |

## Testing
Jalankan perintah berikut untuk menjalankan pengujian otomatis:
```bash
npm test
```