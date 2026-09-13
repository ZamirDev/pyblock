$ErrorActionPreference = 'Stop'
$css = Get-Content 'public\fonts\fonts.css' -Raw
$blocks = [regex]::Matches($css, '@font-face\s*\{(?<body>[^}]*)\}')
$i = 0
foreach ($b in $blocks) {
  $body = $b.Groups['body'].Value

  $famMatch = [regex]::Match($body, 'font-family:\s*''([^'']+)''')
  $fam = $famMatch.Groups[1].Value

  $wght = [regex]::Match($body, 'font-weight:\s*(\d+)').Groups[1].Value
  $url = [regex]::Match($body, 'url\(([^)]+\.woff2)\)').Groups[1].Value

  if (-not $url) { continue }

  $fn = 'fonts/' + ($fam -replace '\s+', '') + '-' + $wght + '.woff2'
  Invoke-WebRequest -Uri $url -OutFile (Join-Path 'public' $fn) -UseBasicParsing
  $i++
}
Write-Output "downloaded=$i"