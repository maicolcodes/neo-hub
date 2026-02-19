$ErrorActionPreference = "Stop"

Write-Host "== DEV ==" -ForegroundColor Cyan
if (!(Test-Path ".env.local")) {
  Write-Host ".env.local não existe. Rodando vercel env pull..." -ForegroundColor Yellow
  vercel env pull .env.local
}

npm install
npm run dev
