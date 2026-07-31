# ============================================================
# Guedes WebBuilder — Servidor Local
# ============================================================
$port = 8080
$root = $PSScriptRoot

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Guedes WebBuilder — Servidor Local" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Pasta: " -NoNewline
Write-Host $root -ForegroundColor Yellow
Write-Host "   URL:   " -NoNewline
Write-Host "http://localhost:$port" -ForegroundColor Magenta
Write-Host ""

# Tentar Python primeiro (mais estável)
$pythonFound = $false
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $pythonFound = $true
        Write-Host "Usando Python HTTP Server..." -ForegroundColor Gray
        Write-Host ""
        Set-Location $root
        python -m http.server $port
    }
} catch {}

if (-not $pythonFound) {
    # Tentar npx serve
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Usando npx serve..." -ForegroundColor Gray
            Write-Host ""
            npx serve $root -l $port --no-clipboard
            exit
        }
    } catch {}

    # Fallback: .NET HttpListener
    Write-Host "Usando .NET HttpListener..." -ForegroundColor Gray
    Write-Host ""

    Add-Type -AssemblyName System.Web

    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "Servidor rodando em http://localhost:$port" -ForegroundColor Green
    Write-Host "Pressione Ctrl+C para parar." -ForegroundColor Gray

    # MIME types
    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".css" = "text/css"
        ".js" = "application/javascript"
        ".json" = "application/json"
        ".png" = "image/png"
        ".jpg" = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".webp" = "image/webp"
        ".svg" = "image/svg+xml"
        ".ico" = "image/x-icon"
        ".avif" = "image/avif"
        ".woff2" = "font/woff2"
        ".woff" = "font/woff"
    }

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/" -or $localPath -eq "") { $localPath = "/webbuilder.html" }

            $filePath = Join-Path $root $localPath.TrimStart("/")

            Write-Host "  $($request.HttpMethod) $localPath" -ForegroundColor DarkGray

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = $mimeTypes[$ext]
                if (-not $mime) { $mime = "application/octet-stream" }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo não encontrado: $localPath")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }

            $response.OutputStream.Close()
        } catch {
            # Client disconnected, continue
        }
    }
}
