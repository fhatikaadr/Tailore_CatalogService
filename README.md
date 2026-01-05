# Tailoré - Catalog & Inventory Service

Layanan backend untuk manajemen katalog produk dan inventori sistem rental fashion Tailoré.

## ✨ Fitur

- 📦 **Catalog Management** - Browse, search, dan filter produk fashion
- 📊 **Inventory Management** - Stock tracking, adjustment, dan reservasi
- 🔐 **Authentication** - JWT-based auth dengan role admin/user
- 📈 **Stock History** - Audit trail semua perubahan stok
- 🎨 **Modern UI** - Clean interface dengan design system black/pink/white

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Auth:** JWT (JSON Web Token)
- **Frontend:** Vanilla JS, HTML, CSS
- **Deployment:** Docker

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Docker (optional)

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd Tailore_CatalogService

# 2. Install dependencies
npm install

# 3. Seed database (36 products)
npm run seed

# 4. Start server
npm start
```

Server running at: **http://localhost:3001**

### Docker Deployment

```bash
# Build image
docker build -t fhatikaadr/tailore-catalog:latest .

# Run container
docker run -d -p 3001:3001 --name toko-tika --restart always fhatikaadr/tailore-catalog:latest
```

Access at: **https://ooga.queenifyofficial.site/**

## 🔑 Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | user     | user123   |

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user info
```

### Catalog (Public)
```
GET  /api/catalog/products        - List products (paginated, filtered)
GET  /api/catalog/products/:id    - Get product detail
GET  /api/catalog/filters         - Get available filters (brands, categories, colors)
```

### Inventory (Admin Only)
```
GET  /api/inventory/stock                    - Get all inventory
GET  /api/inventory/stock/:id                - Get product inventory
POST /api/inventory/stock/:id/adjust         - Adjust stock quantity
POST /api/inventory/stock/:id/reserve        - Reserve stock for order
GET  /api/inventory/alerts                   - Get low stock alerts
```

### Example Request

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Products:**
```bash
curl http://localhost:3001/api/catalog/products?page=1&limit=12
```

**Adjust Stock (Admin):**
```bash
curl -X POST http://localhost:3001/api/inventory/stock/{productId}/adjust \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":10,"reason":"Restock from supplier"}'
```

## 📁 Project Structure

```
Tailore_CatalogService/
├── src/
│   ├── config/          # Database & JWT config
│   ├── database/        # DB initialization & seeding
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   └── server.js        # Main application
├── public/
│   └── index.html       # Frontend UI
├── data/
│   └── catalog.db       # SQLite database
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies
```

## 🔧 Scripts

```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run seed        # Seed database (36 products)
npm run init-db     # Initialize database tables only
```

## 🌐 Environment Variables

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
DB_PATH=./data/catalog.db
CSV_PATH=../outfits.csv
```

## 📊 Database

- **36 products** total (3 pages × 12 products per page)
- Inventory tracked dengan available/reserved quantities
- Stock history untuk audit trail
- User management dengan role-based access

## 🎨 UI Features

**Guest/User:**
- Browse catalog dengan pagination
- Search & filter (brand, category, color)
- View product details dengan stock info

**Admin:**
- Semua fitur user
- Inventory dashboard dengan stats
- Stock management & adjustment
- Low stock alerts

## 📝 License

This project is part of Tailoré e-commerce system.

## 👤 Author

**Fhatika Adhalisman Ryanjani - 18223062**
