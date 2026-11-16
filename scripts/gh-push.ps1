# Git kurulu olmayan Windows bilgisayarda GitHub CLI (gh) ile commit + push.
# Dosyaları GitHub API üzerinden tek commit olarak main'e yazar. Giriş: gh auth login (bir kez).
# Kullanım (repo kökünden):
#   powershell -ExecutionPolicy Bypass -File scripts\gh-push.ps1 -Message "mesaj" -Files "public/a.css,public/b.html" [-ExpectSha <sha>]
#   -ExpectSha: main beklenen commit'te değilse (başkası push'lamışsa) durur. Bilmiyorsan önce:
#   gh api repos/Cihanpehlivan/ucpehlivan-site/git/ref/heads/main --jq .object.sha
# Yayın (push'tan sonra, ayrı adım):
#   gh workflow run yayinla.yml -R Cihanpehlivan/ucpehlivan-site -f hedef=onizleme   (sonra hedef=canli)
#   gh run watch <id> -R Cihanpehlivan/ucpehlivan-site --exit-status
param([string]$Message, [string[]]$Files, [string]$ExpectSha, [string]$RepoDir = (Resolve-Path "$PSScriptRoot\..").Path)
$ErrorActionPreference = 'Stop'
# -File ile çağrılınca liste tek metin gelir ("a,b"): virgülden böl.
$Files = @($Files | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$gh =(Get-Command gh -ErrorAction SilentlyContinue).Source
if (-not $gh) { $gh = 'C:\Program Files\GitHub CLI\gh.exe' }
$repo = 'repos/Cihanpehlivan/ucpehlivan-site'
$tmp = Join-Path $env:TEMP 'gh-push'; New-Item -ItemType Directory -Force $tmp | Out-Null

function Api($method, $path, $body) {
  $f = Join-Path $tmp 'body.json'
  if ($body) { [IO.File]::WriteAllText($f, ($body | ConvertTo-Json -Depth 10 -Compress), (New-Object Text.UTF8Encoding $false)); $out = & $gh api -X $method $path --input $f }
  else { $out = & $gh api -X $method $path }
  if ($LASTEXITCODE -ne 0) { throw "gh api $method $path failed" }
  return ($out | Out-String | ConvertFrom-Json)
}

$ref = Api GET "$repo/git/ref/heads/main"
$baseSha = $ref.object.sha
"main: $baseSha"
if ($ExpectSha -and $baseSha -ne $ExpectSha) { throw "main $baseSha konumunda (beklenen $ExpectSha). Önce uzak değişiklikleri al." }
$baseCommit = Api GET "$repo/git/commits/$baseSha"

$tree = @()
foreach ($p in $Files) {
  $p = $p -replace '\\', '/'
  $bytes = [IO.File]::ReadAllBytes((Join-Path $RepoDir $p))
  $blob = Api POST "$repo/git/blobs" @{ content = [Convert]::ToBase64String($bytes); encoding = 'base64' }
  $tree += @{ path = $p; mode = '100644'; type = 'blob'; sha = $blob.sha }
}
$newTree = Api POST "$repo/git/trees" @{ base_tree = $baseCommit.tree.sha; tree = $tree }
$commit = Api POST "$repo/git/commits" @{ message = $Message; tree = $newTree.sha; parents = @($baseSha) }
$upd = Api PATCH "$repo/git/refs/heads/main" @{ sha = $commit.sha; force = $false }
"push: $($commit.sha) → main"
$commit.html_url
