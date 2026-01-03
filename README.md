# Tailoré - Catalog & Inventory Service

Layanan mikroservice untuk manajemen katalog produk dan inventori dalam sistem e-commerce Tailoré. Service ini merupakan bagian dari **Catalog & Inventory Context** yang menangani data produk pakaian, harga, stok, dan operasi manajemen inventori.

## 📋 Deskripsi

Catalog & Inventory Service adalah layanan backend yang bertanggung jawab untuk:
- **Manajemen Katalog**: CRUD operasi produk, pencarian dan filtering produk
- **Manajemen Inventori**: Tracking stok, reserve/release/commit stock
- **Autentikasi & Autorisasi**: JWT-based authentication dengan role-based access control
- **Stock History**: Audit trail untuk semua perubahan stok

Service ini dibangun menggunakan:
- **Node.js** & **Express.js** untuk backend framework
- **SQLite** untuk database
- **JWT** untuk authentication
- **Docker** untuk containerization

## 🏗️ Arsitektur

### Domain-Driven Design
Service ini mengimplementasikan **Catalog & Inventory Bounded Context** dengan subdomain:
- **Product Listing Service** (Supporting Subdomain)
- **Stock Tracking Service** (Supporting Subdomain)

### Database Schema
- `users` - Data user dan role untuk authentication
- `products` - Katalog produk dengan detail lengkap
- `inventory` - Stock management dengan tracking available/reserved
- `stock_history` - Audit trail untuk perubahan stok

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js v18 atau lebih tinggi
- npm atau yarn
- Docker (untuk deployment)
- File `outfits.csv` di directory parent

### 1. Clone Repository
```bash
git clone <repository-url>
cd Tailore_CatalogService
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy .env.example ke .env
copy .env.example .env

# Edit .env sesuai kebutuhan
```

Konfigurasi `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
DB_PATH=./data/catalog.db
CSV_PATH=../outfits.csv
```

### 4. Initialize Database & Seed Data
```bash
# Initialize database tables
npm run init-db

# Seed database dengan data dari outfits.csv
npm run seed
```

**Default Users Created:**
- Admin: `username: admin`, `password: admin123`
- User: `username: user`, `password: user123`

### 5. Start Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🎨 Akses Frontend

Buka browser dan akses:
```
http://localhost:3000
```

**Frontend Features:**
- 👔 Browse 15,649+ products dengan design bold black-pink-white
- 🔍 Search & advanced filtering (brand, category, color, size)
- 📱 Responsive design (mobile & desktop)
- 🔐 Login/Logout dengan JWT authentication
- 👑 Admin dashboard untuk inventory management
- 📊 Real-time stock tracking

**Default Credentials:**
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

Lihat [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) untuk panduan lengkap.

---

## 🐳 Docker Deployment

### Build & Run dengan Docker Compose
```bash
# Build dan start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t tailore-catalog-service .

# Run container
docker run -d -p 3000:3000 --name catalog-service tailore-catalog-service
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /
GET /health
```

---

## 🔐 Authentication Endpoints

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "role": "user"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 👔 Catalog Endpoints

### 1. Get All Products (Public)
```http
GET /api/catalog/products?page=1&limit=20&search=dress&brand=Sandro&inStock=true
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search in name, description, brand
- `brand` - Filter by brand
- `category` - Filter by category (Dresses, Tops, Pants, etc.)
- `color` - Filter by color
- `size` - Filter by size (XS, S, M, L, XL)
- `gender` - Filter by gender
- `occasion` - Filter by occasion
- `season` - Filter by season
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Filter available products (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "outfit.fffdaa715c3646f8b1c0f04d549ff07e",
      "name": "Asymmetric Frilled Dress",
      "description": "This fun, short dress features...",
      "brand": "Sandro",
      "category": "Dresses",
      "retail_price": 4000.0,
      "price_per_week": 600.0,
      "price_per_month": 1200.0,
      "color": "Black",
      "size": "S",
      "material": "Synthetic, Cotton",
      "gender": "Women",
      "quantity": 25,
      "available_quantity": 23,
      "reserved_quantity": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### 2. Get Product by ID (Public)
```http
GET /api/catalog/products/{productId}
```

### 3. Get Available Filters (Public)
```http
GET /api/catalog/filters
```

Returns all unique values for brands, categories, colors, sizes, genders.

### 4. Create Product (Admin Only)
```http
POST /api/catalog/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "id": "outfit.new001",
  "name": "New Product",
  "description": "Product description",
  "brand": "Brand Name",
  "category": "Dresses",
  "retail_price": 2500.0,
  "price_per_week": 500.0,
  "price_per_month": 1000.0,
  "color": "Blue",
  "size": "M",
  "material": "Cotton",
  "gender": "Women",
  "initial_stock": 20
}
```

### 5. Update Product (Admin Only)
```http
PUT /api/catalog/products/{productId}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "retail_price": 2800.0,
  "description": "Updated description"
}
```

### 6. Delete Product (Admin Only)
```http
DELETE /api/catalog/products/{productId}
Authorization: Bearer <admin-token>
```

---

## 📦 Inventory Endpoints (Requires Authentication)

### 1. Get All Inventory
```http
GET /api/inventory/stock?page=1&limit=50&lowStock=true
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `lowStock` - Filter low stock items (≤10)
- `outOfStock` - Filter out of stock items

### 2. Get Product Inventory
```http
GET /api/inventory/stock/{productId}
Authorization: Bearer <token>
```

### 3. Adjust Stock (Admin Only)
```http
POST /api/inventory/stock/{productId}/adjust
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "quantity": 50,
  "reason": "Restock from supplier"
}
```

Use negative quantity to reduce stock:
```json
{
  "quantity": -10,
  "reason": "Damaged items"
}
```

### 4. Reserve Stock
```http
POST /api/inventory/stock/{productId}/reserve
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

Digunakan saat customer memasukkan item ke cart atau checkout.

### 5. Release Reserved Stock
```http
POST /api/inventory/stock/{productId}/release
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

Digunakan saat customer membatalkan order atau remove dari cart.

### 6. Commit Stock (Finalize Sale)
```http
POST /api/inventory/stock/{productId}/commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

Digunakan saat order berhasil dibayar. Stock akan dikurangi secara permanen.

### 7. Get Stock History
```http
GET /api/inventory/history/{productId}?limit=50
Authorization: Bearer <token>
```

### 8. Get Stock Alerts (Admin Only)
```http
GET /api/inventory/alerts
Authorization: Bearer <admin-token>
```

Returns products that are out of stock or low stock.

---

## 🔄 Stock Management Flow

### Typical Order Flow:

1. **Customer adds to cart**:
   ```
   POST /api/inventory/stock/{productId}/reserve
   ```
   - `available_quantity` berkurang
   - `reserved_quantity` bertambah

2. **Customer cancels or cart timeout**:
   ```
   POST /api/inventory/stock/{productId}/release
   ```
   - Stock kembali available

3. **Customer completes payment**:
   ```
   POST /api/inventory/stock/{productId}/commit
   ```
   - `quantity` (total) berkurang
   - `reserved_quantity` berkurang
   - Stock history tercatat

---

## 🔒 Authentication & Authorization

### Using JWT Token

Setelah login, Anda akan mendapatkan JWT token. Gunakan token ini di header setiap request:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles
- **admin**: Full access - dapat mengelola products dan inventory
- **user**: Limited access - dapat view catalog dan manage reservations

### Protected Endpoints
- ✅ Public: `/api/catalog/products`, `/api/catalog/filters`
- 🔒 User: `/api/inventory/*` (kecuali alerts)
- 👑 Admin: Create/Update/Delete products, Adjust stock, View alerts

---

## 📊 Example Usage with cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Get Products
```bash
curl http://localhost:3000/api/catalog/products?search=dress&inStock=true
```

### 3. Get Product Details
```bash
curl http://localhost:3000/api/catalog/products/outfit.fffdaa715c3646f8b1c0f04d549ff07e
```

### 4. Reserve Stock (with token)
```bash
curl -X POST http://localhost:3000/api/inventory/stock/outfit.fffdaa715c3646f8b1c0f04d549ff07e/reserve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'
```

### 5. Get Stock Alerts (admin)
```bash
curl http://localhost:3000/api/inventory/alerts \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

---

## 🧪 Testing dengan Postman

1. Import collection dari dokumentasi ini
2. Create environment variable:
   - `base_url`: `http://localhost:3000`
   - `token`: (akan diisi setelah login)
3. Login untuk mendapatkan token
4. Set token di environment variable
5. Test endpoints lainnya

---

## 📁 Project Structure

```
Tailore_CatalogService/
├── src/
│   ├── config/
│   │   ├── database.js       # SQLite connection
│   │   └── jwt.js            # JWT configuration
│   ├── database/
│   │   ├── init.js           # Database schema initialization
│   │   └── seed.js           # Seed data from CSV
│   ├── middleware/
│   │   └── auth.js           # Authentication & authorization
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── catalog.js        # Catalog/Product endpoints
│   │   └── inventory.js      # Inventory management endpoints
│   └── server.js             # Express app entry point
├── data/
│   └── catalog.db            # SQLite database (generated)
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore
├── .dockerignore
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose config
├── package.json
└── README.md
```

---

## 🔧 Development

### Install Dev Dependencies
```bash
npm install --save-dev nodemon
```

### Run in Watch Mode
```bash
npm run dev
```

### View Database
Gunakan SQLite browser atau tool seperti:
- DB Browser for SQLite
- SQLite Studio
- VS Code SQLite extension

Database location: `./data/catalog.db`

---

## 🌐 Deployment ke STB (Set Top Box)

### Menggunakan Docker di STB:

1. **Copy project ke STB**:
   ```bash
   scp -r Tailore_CatalogService user@stb-ip:/path/to/deploy/
   ```

2. **SSH ke STB**:
   ```bash
   ssh user@stb-ip
   ```

3. **Build & Run**:
   ```bash
   cd /path/to/deploy/Tailore_CatalogService
   docker-compose up -d
   ```

4. **Check status**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

5. **Access publicly**:
   - Pastikan port 3000 terbuka di firewall
   - Access via: `http://stb-public-ip:3000`

### Environment untuk Production:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-strong-secret>
DB_PATH=/app/data/catalog.db
```

---

## 📈 Monitoring & Logging

### Health Check
```bash
curl http://localhost:3000/health
```

### Docker Logs
```bash
docker-compose logs -f catalog-service
```

### Database Stats
Query jumlah products, inventory status:
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM inventory WHERE available_quantity = 0;
SELECT COUNT(*) FROM inventory WHERE available_quantity <= 10;
```

---

## 🐛 Troubleshooting

### Database not found
```bash
npm run init-db
npm run seed
```

### Port already in use
Ubah PORT di `.env` atau kill process yang menggunakan port 3000.

### CSV file not found
Pastikan `outfits.csv` ada di lokasi yang sesuai dengan `CSV_PATH` di `.env`.

### Docker container not starting
```bash
docker-compose down
docker-compose up --build
```

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)"
}
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing dengan bcrypt
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ Helmet.js untuk HTTP headers security
- ✅ CORS enabled
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)
- ✅ Role-based access control

---

## 🚧 Future Improvements

- [ ] Add pagination caching
- [ ] Implement Redis for session management
- [ ] Add image upload for products
- [ ] Implement full-text search
- [ ] Add API documentation dengan Swagger
- [ ] Unit & integration tests
- [ ] GraphQL endpoint
- [ ] Elasticsearch integration

---

## 👥 Contributors

- **Tailoré Development Team**
- Tugas UAS TST - Catalog & Inventory Service

---

## 📄 License

MIT License - Copyright (c) 2026 Tailoré

---

## 📞 Support

Untuk pertanyaan atau issues:
- Create issue di GitHub repository
- Contact: [your-email@example.com]

---

**Happy Coding! 🚀**
