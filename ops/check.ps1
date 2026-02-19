$ErrorActionPreference = "Stop"

function Has($cmd){ return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

Write-Host "== CHECK ==" -ForegroundColor Cyan
Write-Host "Pasta: $PWD"

if (-not (Has "git"))   { throw "git não encontrado. Instale Git for Windows." }
if (-not (Has "node"))  { throw "node não encontrado. Instale Node.js 22.x." }
if (-not (Has "npm"))   { throw "npm não encontrado (vem junto do Node)." }

if (-not (Has "gh")) {
  Write-Host "GitHub CLI (gh) não encontrado." -ForegroundColor Yellow
  Write-Host "Instale com:" -ForegroundColor Yellow
  Write-Host "  winget install --id GitHub.cli -e" -ForegroundColor Yellow
}

if (-not (Has "vercel")) {
  Write-Host "Vercel CLI não encontrado. Instalando globalmente..." -ForegroundColor Yellow
  npm i -g vercel
}

Write-Host ""
Write-Host "Versões:" -ForegroundColor Cyan
git --version
node -v
npm -v
if (Has "gh")     { gh --version }
vercel --version

Write-Host ""
Write-Host "OK: ferramentas prontas." -ForegroundColor Green
