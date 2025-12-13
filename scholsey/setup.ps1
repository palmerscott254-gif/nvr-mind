# Scholsey Phone Tracker - Complete Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Scholsey Phone Tracker Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentDir = Get-Location

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
$pgRunning = Get-Process postgres -ErrorAction SilentlyContinue
if ($null -eq $pgRunning) {
    Write-Host "⚠️  PostgreSQL is not running!" -ForegroundColor Red
    Write-Host "Please start PostgreSQL before continuing." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location "$currentDir\backend"

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow
npm run prisma:generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
}

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location "$currentDir\web"

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit
}

Set-Location $currentDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "2. In a new terminal, start the frontend:" -ForegroundColor Yellow
Write-Host "   cd web" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open the web app:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "4. Test phone tracking:" -ForegroundColor Yellow
Write-Host "   - Open location-simulator.html in your browser" -ForegroundColor White
Write-Host "   - Or open mobile-tracker.html on your phone" -ForegroundColor White
Write-Host ""
Write-Host "📖 See QUICKSTART.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
