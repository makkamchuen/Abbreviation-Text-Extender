$INPUTFILE= "$($PWD)\ms_abbreviation.txt"
if(!(Test-Path -Path $INPUTFILE -PathType Leaf)){
    "$((Get-Date -Format "dddd MM/dd/yyyy HH:mm K").ToString()) : $INPUTFILE does not exist" | Tee-Object -Append -file import-log.txt
    exit;
}

$word = New-Object -ComObject word.application
$word.visible = $false
$entries = $word.AutoCorrect.entries

foreach($line in Get-Content $INPUTFILE) {
    $arr = $line -split "="
    $key = $arr[0].Trim()
    $value = $arr[1].Trim()
    "$((Get-Date -Format "dddd MM/dd/yyyy HH:mm K").ToString()) : $key = $value" | Tee-Object -Append -file import-log.txt
    $entries.add($key, $value) | out-null
}

$word.Quit()

# Clean up garage collection
$word = $null
[gc]::collect()
[gc]::WaitForPendingFinalizers()