param(
  [switch]$CommitAndPush
)

Write-Host "== NEO: Structure Fix ==" -ForegroundColor Cyan

# 0) Git line endings: parar de aparecer warnings chatos
git config core.autocrlf true | Out-Null
git config core.safecrlf false | Out-Null

# 1) Fix Node version (22.x) - padrão: 22
"22" | Set-Content -Encoding ascii .nvmrc
"22" | Set-Content -Encoding ascii .node-version

# 2) package.json: garantir engines.node
if (!(Test-Path ".\package.json")) { throw "package.json nao encontrado" }
$pkg = Get-Content ".\package.json" -Raw | ConvertFrom-Json

if ($null -eq $pkg.engines) { $pkg | Add-Member -NotePropertyName engines -NotePropertyValue (@{}) }
$pkg.engines.node = "22.x"

$pkg | ConvertTo-Json -Depth 99 | Set-Content -Encoding utf8 ".\package.json"

# 3) Padronizar app/actions.ts (fonte única)
if (!(Test-Path ".\app")) { throw "Pasta app/ nao encontrada. Voce esta no projeto certo?" }

@"
// app/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/utils/supabase/server';

/**
 * PADRAO:
 * - loginAction
 * - signupAction
 * - signOutAction
 * - criarMissaoAction
 *
 * As paginas devem importar SEMPRE daqui:
 * import { loginAction } from '@/app/actions';
 */

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) redirect('/login?error=Email%20e%20senha%20obrigatorios');

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect('/login?error=Email%20ou%20senha%20invalidos');
  redirect('/pos-login');
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? 'aluno');

  if (!email || !password) redirect('/cadastrar?error=Email%20e%20senha%20obrigatorios');

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) redirect('/cadastrar?error=Falha%20ao%20criar%20conta');

  const userId = data.user?.id;
  if (userId) {
    // garante profile
    await supabase.from('profiles').upsert({ id: userId, role }, { onConflict: 'id' });
  }

  redirect('/login');
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function criarMissaoAction(formData: FormData) {
  const titulo = String(formData.get('titulo') ?? '').trim();

  if (!titulo) redirect('/lancar-missao?error=Informe%20um%20titulo');

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id;

  if (!userId) redirect('/login?error=Faça%20login%20novamente');

  // Ajuste para sua tabela real (se for diferente, me fale o nome/colunas)
  const { error } = await supabase.from('missoes').insert({
    titulo,
    criado_por: userId
  });

  if (error) redirect('/lancar-missao?error=Falha%20ao%20criar%20missao');

  redirect('/painel');
}
"@ | Set-Content -Encoding utf8 ".\app\actions.ts"

Write-Host "OK: app/actions.ts padronizado" -ForegroundColor Green

# 4) Auto-fix imports/uso nas pages (entrar/login/lancar-missao etc.)
$targets = Get-ChildItem ".\app" -Recurse -File -Include *.tsx,*.ts

function Replace-InFile($path, $pairs) {
  $c = Get-Content $path -Raw
  $orig = $c
  foreach ($p in $pairs) {
    $c = $c -replace $p[0], $p[1]
  }
  if ($c -ne $orig) {
    Set-Content -Encoding utf8 $path $c
    Write-Host "Fix: $path" -ForegroundColor Yellow
  }
}

$pairs = @(
  # imports errados mais comuns
  @("import\s+\{\s*login\s*\}\s+from\s+['""]@\/app\/actions['""]\s*;","import { loginAction } from '@/app/actions';"),
  @("import\s+\{\s*login\s*\}\s+from\s+['""]@\/app\/actions['""]","import { loginAction } from '@/app/actions'"),
  @("import\s+\{\s*criarMissao\s*\}\s+from\s+['""]@\/app\/actions['""]\s*;","import { criarMissaoAction } from '@/app/actions';"),
  @("import\s+\{\s*criarMissao\s*\}\s+from\s+['""]@\/app\/actions['""]","import { criarMissaoAction } from '@/app/actions'"),

  # trocas de action={...} no form
  @("action=\{\s*login\s*\}","action={loginAction}"),
  @("action=\{\s*criarMissao\s*\}","action={criarMissaoAction}")
)

foreach ($f in $targets) {
  Replace-InFile $f.FullName $pairs
}

# 5) build local (pra garantir que não vai explodir na Vercel)
Write-Host "Rodando npm run build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build falhou. Copie o erro e me mande o print." }

Write-Host "BUILD OK" -ForegroundColor Green

if ($CommitAndPush) {
  git add -A
  git commit -m "chore: padroniza actions + node 22.x + auto-fix imports" | Out-Null
  git push
  Write-Host "OK: commit+push feitos" -ForegroundColor Green
}

Write-Host "== FIM ==" -ForegroundColor Cyan
