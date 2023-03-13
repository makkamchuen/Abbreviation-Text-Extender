$OUTPUTFILE= "$($PWD)\ms_abbreviation.txt"
if(Test-Path -Path $OUTPUTFILE -PathType Leaf){
    "$((Get-Date -Format "dddd MM/dd/yyyy HH:mm K").ToString()) : $OUTPUTFILE already exists, please delete it before export the new list" | Tee-Object -Append -file export-log.txt
    exit;
}

$word = New-Object -ComObject word.application
$word.visible = $false

# Output a JSON file
# $word.AutoCorrect.entries  | Where-Object {$_.RichText -eq $false} | Select-Object -Property Name , Value, RichText | ConvertTo-Json | Out-File output.json
"$((Get-Date -Format "dddd MM/dd/yyyy HH:mm K").ToString()) : Exporting Auto Correction List from MS Word" | Tee-Object -Append -file export-log.txt
$entries = $word.AutoCorrect.entries  | Where-Object {$_.RichText -eq $false} | Select-Object -Property Name , Value, RichText
foreach ($entry in $entries)
{ 
    "$((Get-Date -Format "dddd MM/dd/yyyy HH:mm K").ToString()) : $entry" | Tee-Object -Append -file export-log.txt
    $entry.Name + " = " + $entry.Value | Out-File -FilePath $OUTPUTFILE -Append
}
$word.Quit()

# Clean up garage collection
$word = $null
[gc]::collect()
[gc]::WaitForPendingFinalizers()