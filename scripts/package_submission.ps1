param(
  [string]$OutputDir = "dist"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$packageDir = Join-Path $OutputDir "city-scout-submission"
if (Test-Path -LiteralPath $packageDir) {
  Remove-Item -LiteralPath $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $packageDir | Out-Null

Copy-Item -LiteralPath "submission\skill.md" -Destination (Join-Path $packageDir "skill.md") -Force
Copy-Item -LiteralPath "submission\tutorial.md" -Destination (Join-Path $packageDir "tutorial.md") -Force
Copy-Item -LiteralPath "submission\form_fields_1000.md" -Destination (Join-Path $packageDir "form_fields_1000.md") -Force
Copy-Item -LiteralPath "submission\demo_script.md" -Destination (Join-Path $packageDir "demo_script.md") -Force
Copy-Item -LiteralPath "submission\social_post.md" -Destination (Join-Path $packageDir "social_post.md") -Force
Copy-Item -LiteralPath "submission\promotion_mvp_pack.md" -Destination (Join-Path $packageDir "promotion_mvp_pack.md") -Force
Copy-Item -LiteralPath "submission\real_api_run_report.md" -Destination (Join-Path $packageDir "real_api_run_report.md") -Force
Copy-Item -LiteralPath "submission\amap_api_integration.md" -Destination (Join-Path $packageDir "amap_api_integration.md") -Force
Copy-Item -LiteralPath "README.md" -Destination (Join-Path $packageDir "README.md") -Force

New-Item -ItemType Directory -Force -Path (Join-Path $packageDir "scripts") | Out-Null
Copy-Item -LiteralPath "scripts\test_amap_web_service.mjs" -Destination (Join-Path $packageDir "scripts\test_amap_web_service.mjs") -Force
Copy-Item -LiteralPath "scripts\amap_demo_server.mjs" -Destination (Join-Path $packageDir "scripts\amap_demo_server.mjs") -Force
Copy-Item -LiteralPath ".env.example" -Destination (Join-Path $packageDir ".env.example") -Force

New-Item -ItemType Directory -Force -Path (Join-Path $packageDir "demo") | Out-Null
Copy-Item -LiteralPath "demo\index.html" -Destination (Join-Path $packageDir "demo\index.html") -Force
Copy-Item -LiteralPath "demo\scale.html" -Destination (Join-Path $packageDir "demo\scale.html") -Force

New-Item -ItemType Directory -Force -Path (Join-Path $packageDir "city-scout-amap-skill") | Out-Null
Copy-Item -LiteralPath "city-scout-amap-skill\*" -Destination (Join-Path $packageDir "city-scout-amap-skill") -Recurse -Force

$zipPath = Join-Path $OutputDir "city-scout-submission.zip"
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -LiteralPath $packageDir -DestinationPath $zipPath -Force

Get-ChildItem -LiteralPath $packageDir -Recurse -File |
  Select-Object FullName, Length

Write-Host ""
Write-Host "Created: $zipPath"


