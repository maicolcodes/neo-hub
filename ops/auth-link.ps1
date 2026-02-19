$ErrorActionPreference = "Stop"

Write-Host "== AUTH + LINK ==" -ForegroundColor Cyan

# GitHub auth (se gh existir)
if (Get-Command gh -ErrorAction SilentlyContinue) {
  $s = (gh auth status 2>$null)
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Fazendo login no GitHub (gh auth login)..." -ForegroundColor Yellow
    gh auth login
  } else {
    Write-Host "GitHub: já autenticado." -ForegroundColor Green
  }
} else {
  Write-Host "gh não instalado. Pulei GitHub auth." -ForegroundColor Yellow
}

# Vercel login
try { vercel whoami | Out-Null } catch {}
if ($LASTEXITCODE -ne 0) {
  Write-Host "Fazendo login na Vercel..." -ForegroundColor Yellow
  vercel login
} else {
  Write-Host "Vercel: já autenticado." -ForegroundColor Green
}

# Link do projeto (gera .vercel)
Write-Host "Linkando projeto (vercel link)..." -ForegroundColor Yellow
vercel link

# Puxa env do projeto para .env.local (fonte da verdade local)
Write-Host "Puxando env (vercel env pull .env.local)..." -ForegroundColor Yellow
vercel env pull .env.local

Write-Host ""
Write-Host "OK: autenticado + projeto linkado + .env.local atualizado." -ForegroundColor Green
