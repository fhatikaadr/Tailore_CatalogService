# Tailoré Catalog & Inventory Service - API Testing Guide

## Quick Start

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Server will run on**: `http://localhost:3000`

---

## Testing dengan curl (PowerShell)

### 1. Health Check
```powershell
curl.exe http://localhost:3000/health
```

### 2. Login (Get Token)
```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

**Save the token from response!**

### 3. Get All Products
```powershell
curl.exe http://localhost:3000/api/catalog/products?page=1&limit=10
```

### 4. Search Products
```powershell
curl.exe "http://localhost:3000/api/catalog/products?search=dress&inStock=true"
```

### 5. Get Product by ID
```powershell
curl.exe http://localhost:3000/api/catalog/products/outfit.fffdaa715c3646f8b1c0f04d549ff07e
```

### 6. Get Inventory Stock (Requires Authentication)
```powershell
$token = "YOUR_TOKEN_HERE"
curl.exe http://localhost:3000/api/inventory/stock `
  -H "Authorization: Bearer $token"
```

### 7. Reserve Stock (Requires Authentication)
```powershell
$token = "YOUR_TOKEN_HERE"
curl.exe -X POST http://localhost:3000/api/inventory/stock/outfit.fffdaa715c3646f8b1c0f04d549ff07e/reserve `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{\"quantity\":2}'
```

### 8. Get Stock Alerts (Admin Only)
```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"
curl.exe http://localhost:3000/api/inventory/alerts `
  -H "Authorization: Bearer $token"
```

---

## Testing dengan PowerShell Invoke-RestMethod

### 1. Login
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'

$token = $loginResponse.data.token
Write-Host "Token: $token"
```

### 2. Get Products
```powershell
$products = Invoke-RestMethod -Uri "http://localhost:3000/api/catalog/products?limit=5" `
  -Method Get

$products.data | Format-Table id, name, brand, retail_price, available_quantity
```

### 3. Get Inventory with Auth
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$inventory = Invoke-RestMethod -Uri "http://localhost:3000/api/inventory/stock?limit=10" `
  -Method Get `
  -Headers $headers

$inventory.data | Format-Table id, name, quantity, available_quantity, reserved_quantity
```

### 4. Reserve Stock
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    quantity = 2
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/api/inventory/stock/outfit.fffdaa715c3646f8b1c0f04d549ff07e/reserve" `
  -Method Post `
  -Headers $headers `
  -Body $body

$result
```

---

## Complete Test Script (PowerShell)

Save this as `test-api.ps1`:

```powershell
# Tailoré API Test Script

$baseUrl = "http://localhost:3000"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Tailoré API Testing" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   ✓ Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login
Write-Host "2. Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.data.token
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    Write-Host "   ✓ User: $($loginResponse.data.user.username)" -ForegroundColor Green
    Write-Host "   ✓ Role: $($loginResponse.data.user.role)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 3: Get Products
Write-Host "3. Testing Get Products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/catalog/products?limit=5" -Method Get
    Write-Host "   ✓ Found $($products.pagination.total) products" -ForegroundColor Green
    Write-Host "   ✓ Showing first $($products.data.Count) products:" -ForegroundColor Green
    $products.data | ForEach-Object {
        Write-Host "      - $($_.name) ($($_.brand)) - Rp $($_.retail_price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Search Products
Write-Host "4. Testing Search Products (dress)..." -ForegroundColor Yellow
try {
    $searchResults = Invoke-RestMethod -Uri "$baseUrl/api/catalog/products?search=dress&limit=3" -Method Get
    Write-Host "   ✓ Found $($searchResults.pagination.total) dresses" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Inventory
Write-Host "5. Testing Get Inventory..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $inventory = Invoke-RestMethod -Uri "$baseUrl/api/inventory/stock?limit=5" `
        -Method Get `
        -Headers $headers
    
    Write-Host "   ✓ Retrieved inventory for $($inventory.data.Count) products" -ForegroundColor Green
    $inventory.data | ForEach-Object {
        Write-Host "      - $($_.name): Available=$($_.available_quantity), Reserved=$($_.reserved_quantity)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Stock Alerts
Write-Host "6. Testing Stock Alerts (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $alerts = Invoke-RestMethod -Uri "$baseUrl/api/inventory/alerts" `
        -Method Get `
        -Headers $headers
    
    Write-Host "   ✓ Out of Stock: $($alerts.summary.outOfStockCount) products" -ForegroundColor Green
    Write-Host "   ✓ Low Stock: $($alerts.summary.lowStockCount) products" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
```

Run with:
```powershell
.\test-api.ps1
```

---

## Postman Collection

Import the `postman_collection.json` file included in this project:

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json`
4. Set variables:
   - `base_url`: `http://localhost:3000`
5. Run "Login" request first
6. Token will be automatically saved
7. Test other endpoints

---

## Common Product IDs for Testing

```
outfit.fffdaa715c3646f8b1c0f04d549ff07e
outfit.fffa1b9a3db6415d806f3c48f8ab58d9
outfit.fff175b13ceb453f9928625491412ede
outfit.ffef9d7c292a48b69076d2df2e32352f
outfit.ffeef842238f4dbdabc6c730a75aa2bd
```

---

## Default Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`
  
- **User**: 
  - Username: `user`
  - Password: `user123`

---

## Troubleshooting

### Server not responding
```powershell
# Check if server is running
Get-Process node

# Restart server
npm start
```

### Token expired
Login again to get a new token.

### Database issues
```powershell
# Reinitialize database
npm run init-db
npm run seed
```
