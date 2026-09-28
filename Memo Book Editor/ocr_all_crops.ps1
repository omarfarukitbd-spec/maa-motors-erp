Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
$cropFiles = Get-ChildItem -Path "crops" -Filter "*.png" | Sort-Object Name

$results = @()

foreach ($f in $cropFiles) {
    $filePath = $f.FullName
    $pageNum = [int]($f.BaseName -replace 'crop_','')
    
    $storageFile = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
    $stream = Await ($storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
    $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $ocrResult = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    
    $wordsList = @()
    foreach ($line in $ocrResult.Lines) {
        foreach ($word in $line.Words) {
            $wordsList += @{
                Text = $word.Text
                X = $word.BoundingRect.X
                Y = $word.BoundingRect.Y
                W = $word.BoundingRect.Width
                H = $word.BoundingRect.Height
            }
        }
    }
    
    $results += @{
        Page = $pageNum
        RawText = $ocrResult.Text
        Words = $wordsList
    }
}

$results | ConvertTo-Json -Depth 5 | Set-Content "ocr_results.json" -Encoding UTF8
Write-Output "OCR finished for $($cropFiles.Count) pages. Saved to ocr_results.json."
