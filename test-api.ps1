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
    Write-Host "   [OK] Status: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
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
    Write-Host "   [OK] Login successful" -ForegroundColor Green
    Write-Host "   [OK] User: $($loginResponse.data.user.username)" -ForegroundColor Green
    Write-Host "   [OK] Role: $($loginResponse.data.user.role)" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 3: Get Products
Write-Host "3. Testing Get Products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/catalog/products?limit=5" -Method Get
    Write-Host "   [OK] Found $($products.pagination.total) products" -ForegroundColor Green
    Write-Host "   [OK] Showing first $($products.data.Count) products:" -ForegroundColor Green
    $products.data | ForEach-Object {
        Write-Host "      - $($_.name) ($($_.brand)) - Rp $($_.retail_price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Search Products
Write-Host "4. Testing Search Products (dress)..." -ForegroundColor Yellow
try {
    $searchResults = Invoke-RestMethod -Uri "$baseUrl/api/catalog/products?search=dress&limit=3" -Method Get
    Write-Host "   [OK] Found $($searchResults.pagination.total) dresses" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
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
    
    Write-Host "   [OK] Retrieved inventory for $($inventory.data.Count) products" -ForegroundColor Green
    $inventory.data | ForEach-Object {
        Write-Host "      - $($_.name): Available=$($_.available_quantity), Reserved=$($_.reserved_quantity)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
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
    
    Write-Host "   [OK] Out of Stock: $($alerts.summary.outOfStockCount) products" -ForegroundColor Green
    Write-Host "   [OK] Low Stock: $($alerts.summary.lowStockCount) products" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get Filters
Write-Host "7. Testing Get Filters..." -ForegroundColor Yellow
try {
    $filters = Invoke-RestMethod -Uri "$baseUrl/api/catalog/filters" -Method Get
    Write-Host "   [OK] Available Brands: $($filters.data.brands.Count)" -ForegroundColor Green
    Write-Host "   [OK] Available Categories: $($filters.data.categories.Count)" -ForegroundColor Green
    Write-Host "   [OK] Available Colors: $($filters.data.colors.Count)" -ForegroundColor Green
    Write-Host "   [OK] Available Sizes: $($filters.data.sizes.Count)" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
