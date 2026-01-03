# Video Script - Tailoré Catalog & Inventory Service
## Durasi Target: 8-10 menit

---

## 🎬 INTRODUCTION (1 menit)

**[Tampilkan diri Anda di layar]**

"Halo semuanya! Selamat datang di video demonstrasi Tailoré Catalog & Inventory Service."

**[Tunjukkan judul di screen]**
- Nama: Tailoré Catalog & Inventory Service
- Tugas: UAS TST - Microservices Architecture
- Sistem: E-Commerce Platform untuk Rental Pakaian

"Hari ini saya akan mendemonstrasikan microservice yang saya kembangkan untuk sistem e-commerce Tailoré. Service ini adalah bagian dari Catalog & Inventory Context yang bertanggung jawab untuk manajemen produk dan stok inventori."

---

## 📋 OVERVIEW SISTEM (1.5 menit)

**[Tampilkan diagram arsitektur]**

"Tailoré adalah aplikasi rental pakaian online yang dibangun dengan arsitektur microservices. Sistem ini dibagi menjadi dua Bounded Context utama:"

1. **Catalog & Inventory Context** (yang saya kembangkan)
   - Product Listing Service
   - Stock Tracking Service

2. **Order & Sales Context**
   - Transaction Service
   - Cart Service

"Fokus saya adalah pada Catalog & Inventory Context. Service ini menangani:"
- ✅ Manajemen katalog produk
- ✅ Pencarian dan filtering
- ✅ Tracking stok real-time
- ✅ Reserve/Release/Commit stock operations
- ✅ Authentication & Authorization dengan JWT

**[Tampilkan tech stack]**
- Backend: Node.js + Express
- Database: SQLite
- Authentication: JWT (JSON Web Token)
- Containerization: Docker
- Dataset: 15,000+ produk dari CSV

---

## 💻 DEMO LOKAL (3.5 menit)

**[Tampilkan terminal dan VS Code]**

### Setup & Running

```bash
# 1. Lihat struktur project
ls

# 2. Install dependencies (skip jika sudah)
npm install

# 3. Start server
npm start
```

**[Tunjukkan output]**
"Server sekarang running di port 3000. Mari kita test frontend dan API."

### Frontend Demo

**[Buka browser: http://localhost:3000]**

"Ini adalah frontend yang saya buat dengan design bold black-pink-white yang modern dan eye-catching."

**1. Homepage/Catalog**
- "Di halaman utama, kita bisa lihat 15,649 produk dalam grid layout yang clean"
- "Setiap card menampilkan brand, nama produk, ukuran, warna, harga, dan stock"
- "Design menggunakan hard shadows dan sharp edges untuk aesthetic yang bold"

**2. Search & Filter**
- "Mari kita coba search..."
  ```
  Search: "dress"
  Apply Filters
  ```
- "Filter juga tersedia untuk brand, category, dan color"
  ```
  Brand: Sandro
  Apply Filters
  ```

**3. Product Detail**
- Click "VIEW DETAILS" pada salah satu product
- "Modal ini menampilkan informasi lengkap: deskripsi, material, harga rental, dan stock real-time"
- Close modal

**4. Authentication**
- Click "LOGIN" button
- "Saya akan login sebagai admin untuk akses inventory management"
  ```
  Username: admin
  Password: admin123
  ```
- "Login successful! Username muncul di header"

**5. Inventory Dashboard (Admin)**
- Click tab "INVENTORY"
- "Sebagai admin, saya bisa lihat dashboard dengan statistics:"
  - Total products
  - Low stock alerts  
  - Out of stock count
- "Table menampilkan semua inventory dengan quantity, available, dan reserved"

**6. Stock Adjustment**
- Click "ADJUST" pada salah satu product
- "Admin bisa adjust stock dengan mudah"
  ```
  Quantity: +50
  Reason: Restock from supplier
  Submit
  ```
- "Stock berhasil diupdate, dan tercatat dalam history untuk audit"

### API Testing (Backend)

**[Split screen atau switch ke Postman]**

"Sekarang mari kita lihat API backend yang mendukung frontend ini."

1. **Login**
   ```
   POST /api/auth/login
   ```
   "Saya login sebagai admin dan mendapat JWT token."

2. **Get Products dengan Filter**
   ```
   GET /api/catalog/products?search=dress&brand=Sandro&inStock=true
   ```
   "Saya bisa filter by search keyword, brand, color, size, price range, dll."

3. **Get Product Detail**
   ```
   GET /api/catalog/products/{id}
   ```
   "Setiap produk punya detail lengkap: harga, ukuran, warna, material, dan stok."

4. **Reserve Stock**
   ```
   POST /api/inventory/stock/{id}/reserve
   ```
   "Ketika customer add to cart, stock direserve. Available quantity berkurang tapi total quantity tetap."

5. **Get Stock Alerts**
   ```
   GET /api/inventory/alerts
   ```
   "Admin bisa lihat produk yang low stock atau out of stock."

---

## 🐳 DOCKER DEPLOYMENT (2 menit)

**[Tampilkan Dockerfile dan docker-compose.yml]**

"Service ini sudah siap untuk deployment dengan Docker."

### Build & Run dengan Docker

```bash
# Build image
docker build -t tailore-catalog-service .

# Run dengan docker-compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

**[Tunjukkan container running]**

"Container sekarang running. Database persistent dengan volume Docker."

**[Test endpoint dari container]**
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/catalog/products?limit=5
```

---

## 🎯 KEY FEATURES (1.5 menit)

**[Tampilkan kembali ke browser/VS Code]**

### 1. Frontend Design
"Frontend ini didesain dengan theme Bold Black Pink White yang terinspirasi dari high-fashion editorial."
- High contrast untuk readability maksimal
- Hard shadows untuk depth
- Sharp edges untuk modern aesthetic
- Pink accents untuk brand identity
- Responsive design (mobile & desktop ready)

### 2. Authentication & Authorization
"Service ini menggunakan JWT untuk authentication dengan role-based access control."
- Public endpoints: browse catalog
- User endpoints: inventory operations (untuk development order features)
- Admin endpoints: adjust stock, view alerts, full inventory management

### 3. Stock Management Flow
**[Tampilkan diagram alur]**
```
Customer Add to Cart → Reserve Stock
Customer Checkout → Keep Reserved
Payment Success → Commit Stock (reduce permanently)
Payment Failed/Cancel → Release Stock (back to available)
```

### 4. Database Design
**[Tampilkan schema]**
- Products: catalog data (15K+ products)
- Inventory: stock tracking (quantity, available, reserved)
- Stock History: audit trail
- Users: authentication

### 5. Full-Stack Features
**Frontend:**
- Interactive product catalog
- Advanced search & filtering
- Real-time stock display
- Admin dashboard
- Responsive mobile design

**Backend:**
- RESTful API (20+ endpoints)
- JWT authentication
- Pagination & filtering
- Stock management operations
- Audit logging
- Rate limiting & security

---

## 🚀 DEPLOYMENT ke STB (0.5 menit)

**[Tampilkan DEPLOYMENT.md]**

"Untuk deployment ke STB, saya sudah menyiapkan dokumentasi lengkap:"

```bash
# Transfer ke STB
scp -r Tailore_CatalogService user@stb-ip:/path/

# SSH ke STB
ssh user@stb-ip

# Deploy dengan Docker
cd Tailore_CatalogService
docker-compose up -d
```

"Service bisa diakses publik dengan konfigurasi firewall dan reverse proxy."

---

## 📚 DOCUMENTATION (0.5 menit)

**[Tampilkan README.md]**

"Dokumentasi lengkap tersedia di README.md, mencakup:"
- Installation guide
- Frontend usage guide
- API endpoints documentation
- Authentication flow
- Stock management operations
- Docker deployment
- Troubleshooting

**[Tampilkan file-file]**
- `README.md` - Dokumentasi utama (48 halaman)
- `FRONTEND_GUIDE.md` - Panduan frontend lengkap
- `API_TESTING.md` - Testing guide
- `DEPLOYMENT.md` - Deployment guide
- `DESIGN_SYSTEM.md` - UI/UX design system
- `postman_collection.json` - Postman collection
- `test-api.ps1` - Automated testing script

---

## 🎉 CLOSING (0.5 menit)

**[Kembali ke layar Anda]**

"Jadi, itulah Tailoré Catalog & Inventory Service yang saya kembangkan."

**Recap:**
- ✅ Full-stack microservice (Frontend + Backend)
- ✅ Bold black-pink-white UI design
- ✅ RESTful API dengan JWT authentication
- ✅ Real-time stock management
- ✅ 15,649+ products dari dataset
- ✅ Admin dashboard untuk inventory
- ✅ Docker-ready untuk deployment
- ✅ Complete documentation

"Terima kasih sudah menonton! Jika ada pertanyaan, silakan tulis di kolom komentar."

**[Tampilkan informasi]**
- GitHub: [repository-link]
- Contact: [email]
- Documentation: Full README in repository

"Sampai jumpa di video berikutnya!"

---

## 📝 NOTES UNTUK RECORDING

### BeFrontend accessible di browser
- [ ] Database seeded dengan 15K+ products
- [ ] Postman collection ready
- [ ] Test script berfungsi
- [ ] Docker installed
- [ ] VS Code theme readable
- [ ] Terminal font size besar
- [ ] Browser zoom appropriate (100% atau 110%)
- [ ] VS Code theme readable
- [ ] Terminal font size besar

### Screen Recording Setup:
- [ ] Full screen atau split screen (your face + screen)
- [ ] Audio quality check
- [ ] Microphone test
- [ ] Lighting check
- [ ] Background clean

### During Recording:
- Speak clearly and slowly
- Pause briefly between sections
- Show yourself as presenter
- Point out important parts
- Use zoom for small text
- Keep cursor visible when relevant

### Editing Tips:
- Add captions for technical terms
- Highlight important commands
- Use arrows/circles to point out features
- Add transition between sections
- Background music (subtle, instrumental)
- Intro/outro with text overlay

### YouTube Upload:
- Title: "Tailoré Catalog Service - Microservices Architecture | TST Project"
- Description: Include links to GitHub, documentation
- Tags: microservices, nodejs, express, docker, restapi, jwt
- Thumbnail: Professional with key text

---

## ⏱️ TIME BREAKDOWN

| Section | Duration | Content |
|---------|------30 | Frontend demo + API testing |
| Docker Deployment | 1:3elf intro + project overview |
| System Overview | 1:30 | Architecture + tech stack |
| Local Demo | 3:00 | Setup, test endpoints, Postman |
| Docker Deployment | 2:00 | Build, run, verify |
| Key Features | 1:30 | Explain main features |
| STB Deployment | 0:30 | Quick deployment guide |
| Documentation | 0:30 | Show documentation files |
| Closing | 0:30 | Recap + thank you |
| **TOTAL** | **~10:00** | |

---

**Good luck with your video! 🎥**
