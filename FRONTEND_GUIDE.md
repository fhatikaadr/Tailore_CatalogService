# 🎨 Frontend Guide - Tailoré Catalog Service

## Akses Frontend

Setelah server berjalan, buka browser dan akses:

```
http://localhost:3000
```

atau

```
http://localhost:3000/index.html
```

---

## 🎯 Fitur Frontend

### 1. **CATALOG TAB** (Public Access)

#### Features:
- ✅ **Browse Products** - Lihat 15,649+ produk pakaian
- ✅ **Search** - Cari produk by name, brand, description
- ✅ **Filters** - Filter by brand, category, color
- ✅ **Product Cards** - Tampilan card yang stylish dengan info:
  - Brand
  - Product name
  - Size & Color badges
  - Stock status (In Stock, Low Stock, Out of Stock)
  - Price
  - Available quantity
- ✅ **Product Details** - Click "VIEW DETAILS" untuk info lengkap:
  - Full description
  - Material, gender, occasion, season
  - Rental prices (weekly & monthly)
  - Current stock availability
- ✅ **Pagination** - Navigate through pages
- ✅ **Responsive Design** - Works on mobile & desktop

#### How to Use:
1. **Browse**: Scroll halaman untuk lihat produk
2. **Search**: Ketik di search box, tekan Enter atau click "APPLY FILTERS"
3. **Filter**: Pilih brand/category/color, lalu "APPLY FILTERS"
4. **Reset**: Click "RESET" untuk clear semua filter
5. **View Details**: Click button di product card
6. **Pagination**: Navigate dengan PREV/NEXT atau nomor halaman

---

### 2. **INVENTORY TAB** (Admin Only)

#### Features:
- ✅ **Statistics Dashboard**:
  - Total Products
  - Low Stock Count (≤10 items)
  - Out of Stock Count
- ✅ **Stock Management Table**:
  - View all products with stock info
  - Total Quantity
  - Available Quantity
  - Reserved Quantity
- ✅ **Adjust Stock** - Admin dapat:
  - Add stock (restock)
  - Reduce stock (damaged, lost, etc.)
  - Record reason for audit

#### How to Use:
1. **Login** sebagai admin (username: admin, password: admin123)
2. Click tab **"INVENTORY"**
3. Lihat statistics di bagian atas
4. Browse stock table
5. Click **"ADJUST"** button untuk ubah stock
6. Masukkan quantity (+untuk tambah, -untuk kurang)
7. Masukkan reason (wajib)
8. Submit

---

## 🔐 Authentication

### Guest Mode (Default)
- Dapat browse catalog
- Dapat search & filter
- Dapat view product details
- **TIDAK BISA** akses inventory

### User Login
```
Username: user
Password: user123
```
- Same as guest (untuk demo)
- Could be extended for order features

### Admin Login
```
Username: admin
Password: admin123
```
- Full access ke catalog
- **Access to Inventory tab**
- Dapat adjust stock
- View statistics & alerts

### Login Steps:
1. Click **"LOGIN"** button di header
2. Masukkan username & password
3. Click **"LOGIN NOW"**
4. Success! Username akan muncul di header
5. Admin akan melihat INVENTORY tab

### Logout:
- Click **"LOGOUT"** button di header

---

## 🎨 Design Features

### Color Scheme
- **Black (#000000)** - Primary, headers, buttons
- **Pink Neon (#ff477e)** - Accent, highlights, hover
- **White (#ffffff)** - Background, text
- **Pink Soft (#ffeef2)** - Subtle backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 600 (semibold), 800 (extra bold)
- **Style**: UPPERCASE untuk emphasis, letter-spacing untuk headings

### UI Elements
- ✅ **Bold borders** (2px solid black)
- ✅ **Hard shadows** (8px 8px 0px black) - retro vibes
- ✅ **Sharp corners** - no border radius, edgy look
- ✅ **High contrast** - easy to read
- ✅ **Pink accents** - eye-catching highlights
- ✅ **Hover effects** - smooth transitions

### Components
1. **Product Cards**:
   - Icon placeholder (👔)
   - Brand tag (pink)
   - Product name (bold, uppercase)
   - Badges (size, color, stock status)
   - Price (large, bold)
   - Stock info (color-coded)
   - Action button

2. **Modals**:
   - Login modal
   - Product detail modal
   - Stock adjust modal
   - Close button (×)
   - Form inputs

3. **Tables**:
   - Black header
   - Alternating pink rows
   - Bold fonts
   - Clean borders

4. **Buttons**:
   - Black primary
   - Pink on hover
   - White secondary
   - Disabled state (gray)

---

## 📱 Responsive Design

### Desktop (>768px)
- 4-column filter section
- Multi-column product grid
- Full-width tables
- Side-by-side layouts

### Mobile (<768px)
- Single column layout
- Stacked filters
- Single column product grid
- Scrollable tables
- Hamburger-friendly header

---

## 🚀 Quick Demo Flow

### For Presentation/Video:

1. **Start** - Open homepage
   ```
   http://localhost:3000
   ```

2. **Browse Products** - Show catalog
   - Scroll products grid
   - Point out design elements

3. **Search** - Demo search
   ```
   Search: "dress"
   Apply Filters
   ```

4. **Filter** - Demo filters
   ```
   Brand: Sandro
   Category: Dresses
   Apply Filters
   ```

5. **Product Detail** - Show modal
   - Click "VIEW DETAILS" on any product
   - Show full info, rental prices
   - Close modal

6. **Login** - Authenticate as admin
   ```
   Username: admin
   Password: admin123
   ```

7. **Inventory Tab** - Switch to inventory
   - Show statistics
   - Browse stock table
   - Demo stock adjustment:
     - Click ADJUST
     - Enter +50
     - Reason: "Restock from supplier"
     - Submit
     - Show updated quantity

8. **Logout** - End session

---

## 🎥 Screenshot Points (untuk video)

1. **Homepage** - Clean catalog view
2. **Search Results** - Filtered products
3. **Product Detail Modal** - Full info display
4. **Login Modal** - Authentication UI
5. **Inventory Dashboard** - Stats cards
6. **Stock Management Table** - Admin view
7. **Stock Adjust Modal** - Form UI
8. **Mobile View** - Responsive design

---

## 💡 Tips

### For Better Experience:
- Use Chrome/Firefox for best compatibility
- Enable JavaScript (required)
- Full screen for better view
- Zoom out if cards look too big
- Test both guest and admin modes

### For Demo:
- Prepare sample searches beforehand
- Have product IDs ready for detail view
- Practice stock adjustment flow
- Show mobile responsive (resize browser)
- Highlight design elements (colors, shadows, etc.)

### For Development:
- Open DevTools (F12) for debugging
- Check Console for API calls
- Network tab shows requests
- Refresh (Ctrl+R) if styling breaks
- Clear cache if needed (Ctrl+Shift+R)

---

## 🐛 Troubleshooting

### Page not loading?
```bash
# Check server running
http://localhost:3000/health

# Restart server if needed
npm start
```

### Login not working?
- Check credentials (admin/admin123)
- Check console for errors
- Verify API running on port 3000

### No products showing?
- Check if database seeded
- Run: `npm run seed`
- Check API: `http://localhost:3000/api/catalog/products`

### Inventory tab hidden?
- Must login as admin first
- Username: admin, Password: admin123
- Regular users don't see this tab

### Styling broken?
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check console for CSS errors

---

## 🌐 Public Access (untuk STB)

Setelah deploy ke STB:

```
http://your-stb-ip:3000
```

atau dengan reverse proxy:

```
http://your-domain.com
```

Frontend akan automatically connect ke API pada domain yang sama.

---

## 📋 Checklist untuk Demo

- [ ] Server running di localhost:3000
- [ ] Database seeded dengan 15K+ products
- [ ] Browser siap (Chrome/Firefox)
- [ ] Default credentials diketahui
- [ ] Test search & filters
- [ ] Test product detail modal
- [ ] Test admin login
- [ ] Test inventory management
- [ ] Test stock adjustment
- [ ] Screenshot/screen record ready

---

**Frontend siap digunakan! Enjoy the bold black-pink-white design! 🎨🖤💗**
