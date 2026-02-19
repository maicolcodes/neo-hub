param(
  [string]$Message = "",
  [switch]$NoVercel,
  [switch]$NoBuild
)

$ErrorActionPreference = "Stop"
function Ok($m){ Write-Host " $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "  $m" -ForegroundColor Yellow }
function Fail($m){ Write-Host " $m" -ForegroundColor Red; exit 1 }
function Require-Cmd($name){
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) { Fail "Comando '$name' não encontrado no PATH." }
}
function Ensure-JsonOk($path){
  if (-not (Test-Path $path)) { Fail "Arquivo não encontrado: $path" }
  try { Get-Content $path -Raw | ConvertFrom-Json | Out-Null }
  catch { Fail "package.json está com JSON inválido. Erro: $($_.Exception.Message)" }
}

Info "NEO Deploy Script iniciado..."
Require-Cmd git; Require-Cmd node; Require-Cmd npm
Ok "Ferramentas base OK (git/node/npm)."

Ensure-JsonOk "package.json"
Ok "package.json OK (JSON válido)."

Info "npm install"
npm install
Ok "Dependências OK."

if (-not $NoBuild) {
  Info "Build local (npm run build)"
  npm run build
  Ok "Build local OK."
} else { Warn "Build local ignorado (--NoBuild)." }

$hasChanges = (git status --porcelain)
if ($hasChanges) {
  if ([string]::IsNullOrWhiteSpace($Message)) { $Message = "chore: deploy" }
  Info "Commitando: $Message"
  git add -A
  git commit -m $Message
  Ok "Commit OK."
  Info "Push"
  git push
  Ok "Push OK."
} else {
  Ok "Working tree clean."
}

if ($NoVercel) { Warn "Vercel ignorado (--NoVercel)."; Ok "Finalizado."; exit 0 }

Require-Cmd vercel
try {
  $who = (vercel whoami 2>$null)
  if ([string]::IsNullOrWhiteSpace($who)) { throw "sem whoami" }
  Ok "Logado na Vercel como: $who"
} catch {
  Warn "Não está logado na Vercel. Fazendo login"
  vercel login
  Ok "Login Vercel OK."
}

if (-not (Test-Path ".vercel\project.json")) {
  Warn "Projeto não linkado. Rodando vercel link"
  vercel link
  Ok "Link OK."
} else { Ok "Projeto já linkado." }

Info "vercel env pull (.env.local)"
vercel env pull .env.local --yes | Out-Null
Ok ".env.local atualizado."

Info "Deploy produção (vercel --prod)"
vercel --prod
Ok "Deploy enviado."
Ok "Finalizado com sucesso."
