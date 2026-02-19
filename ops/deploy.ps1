param(
  [string]$Message = "chore: deploy",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

Write-Host "== DEPLOY PROD ==" -ForegroundColor Cyan
Write-Host "Mensagem: $Message"

# build local antes (evita passar vergonha no Vercel)
if (-not $SkipBuild) {
  Write-Host "Instalando deps (npm ci)..." -ForegroundColor Yellow
  npm ci
  Write-Host "Build local (npm run build)..." -ForegroundColor Yellow
  npm run build
} else {
  Write-Host "SkipBuild ativo: pulando build local." -ForegroundColor Yellow
}

# commit/push
Write-Host "Commitando e subindo pro GitHub..." -ForegroundColor Yellow
git add -A
git commit -m $Message 2>$null
git push

# deploy
Write-Host "Deploy na Vercel (prod)..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "OK: deploy concluído." -ForegroundColor Green
