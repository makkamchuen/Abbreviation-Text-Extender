@echo off
setlocal

set SCRIPT_NAME=ms-word-abbr-export.ps1
set SCRIPT_PATH=%~dp0%SCRIPT_NAME%

powershell.exe -ExecutionPolicy Bypass -File "%SCRIPT_PATH%"

endlocal
@pause