Add-Type -AssemblyName System.Drawing

function New-GradientJpg($path, $w, $h, $c1, $c2, $angle) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, $angle)
  $g.FillRectangle($brush, $rect)

  # 은은한 비네트(가장자리 어둡게)
  $vignette = New-Object System.Drawing.Drawing2D.GraphicsPath
  $vignette.AddEllipse(-$w*0.3, -$h*0.3, $w*1.6, $h*1.6)
  $pgBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush($vignette)
  $pgBrush.CenterColor = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
  $pgBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(60, 0, 0, 0))
  $g.FillRectangle($pgBrush, $rect)

  $brush.Dispose()
  $pgBrush.Dispose()
  $g.Dispose()

  $jpgCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]85)
  $bmp.Save($path, $jpgCodec, $params)
  $bmp.Dispose()
}

$brand500 = [System.Drawing.Color]::FromArgb(95, 61, 34)
$brand300 = [System.Drawing.Color]::FromArgb(134, 90, 61)
$brand200 = [System.Drawing.Color]::FromArgb(164, 119, 78)
$stone700 = [System.Drawing.Color]::FromArgb(68, 64, 60)
$stone400 = [System.Drawing.Color]::FromArgb(168, 162, 158)
$stone200 = [System.Drawing.Color]::FromArgb(231, 229, 228)
$amber100 = [System.Drawing.Color]::FromArgb(254, 243, 199)

$base = "c:\Users\user\Desktop\mylandingpage\public\images"

New-GradientJpg "$base\hero-bg.jpg" 1920 1080 $stone700 $brand500 45

New-GradientJpg "$base\procedure\day-1.jpg" 800 600 $brand500 $brand300 30
New-GradientJpg "$base\procedure\day-2.jpg" 800 600 $brand300 $brand200 60
New-GradientJpg "$base\procedure\day-3.jpg" 800 600 $stone700 $brand300 90

New-GradientJpg "$base\reviews\review-1.jpg" 800 800 $stone200 $brand200 45
New-GradientJpg "$base\reviews\review-2.jpg" 800 800 $amber100 $brand300 120
New-GradientJpg "$base\reviews\review-3.jpg" 800 800 $stone400 $brand500 60
New-GradientJpg "$base\reviews\review-4.jpg" 800 800 $brand200 $stone200 150

Write-Output "Done"
