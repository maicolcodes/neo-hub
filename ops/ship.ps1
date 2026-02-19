param(
  [Parameter(Position=0)]
  [string]$Message = "",

  [switch]$Prod,     # se passar -Prod, roda vercel --prod no final
  [switch]$NoBuild   # se passar -NoBuild, pula npm run build
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Say($msg){ Write-Host "==> $msg" -ForegroundColor Cyan }
function Warn($msg){ Write-Host "!!  $msg" -ForegroundColor Yellow }
function Fail($msg){ Write-Host "XX  $msg" -ForegroundColor Red; exit 1 }

# garante que estamos na raiz do repo (onde tem package.json)
if (-not (Test-Path ".\package.json")) {
  Fail "Não achei package.json aqui. Rode na pasta raiz do projeto (ex: C:\dev\neo-hub)."
}

# commit message
if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = Read-Host "Mensagem do commit"
  if ([string]::IsNullOrWhiteSpace($Message)) { Fail "Mensagem do commit não pode ser vazia." }
}

# checa git
Say "Checando Git..."
git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) { Fail "Este diretório não parece ser um repositório Git." }

# branch atual
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Say "Branch atual: $branch"

# checa GH (não impede o ship, mas avisa)
try {
  $ghOk = (gh auth status 2>&1)
  if ($ghOk -match "You are not logged") { Warn "GitHub CLI não autenticado (gh auth login). Isso não impede o push se o git já estiver ok." }
} catch {
  Warn "gh não encontrado (opcional)."
}

# checa Vercel (opcional)
$vercelExists = $true
try { vercel --version *> $null } catch { $vercelExists = $false }
if (-not $vercelExists) {
  Warn "Vercel CLI não encontrado. Se quiser instalar: npm i -g vercel"
} else {
  try {
    $who = (vercel whoami 2>$null)
    if ([string]::IsNullOrWhiteSpace($who)) { Warn "Vercel CLI parece não autenticado. Rode: vercel login" }
    else { Say "Vercel CLI ok: $who" }
  } catch {
    Warn "Vercel CLI pode não estar autenticado. Rode: vercel login"
  }
}

# instala deps (rápido e consistente)
Say "Instalando dependências (npm ci se possível)..."
if (Test-Path ".\package-lock.json") {
  npm ci
} else {
  npm install
}

# build
if (-not $NoBuild) {
  Say "Rodando build..."
  npm run build
} else {
  Warn "Pulando build (-NoBuild)."
}

# status
$status = (git status --porcelain)
if ([string]::IsNullOrWhiteSpace($status)) {
  Warn "Nada para commitar (working tree clean). Vou apenas garantir push está ok."
} else {
  Say "Adicionando mudanças..."
  git add -A

  Say "Commitando..."
  git commit -m $Message
}

# push
Say "Enviando para o GitHub (push)..."
git push

Say "Push concluído. (A Vercel deve buildar automaticamente via Git.)"

# deploy forçado (opcional)
if ($Prod) {
  if (-not $vercelExists) { Fail "Você pediu -Prod, mas não achei o Vercel CLI. Instale com: npm i -g vercel" }

  Say "Forçando deploy em Produção (vercel --prod)..."
  vercel --prod
  Say "Deploy forçado concluído."
}

Say "SHIP finalizado "
