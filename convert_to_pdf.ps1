param (
    [string]$docxPath,
    [string]$pdfPath
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($docxPath)
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close()
    Write-Output "Successfully converted $docxPath to $pdfPath"
}
finally {
    $word.Quit()
}
