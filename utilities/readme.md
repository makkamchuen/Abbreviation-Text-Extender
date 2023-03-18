# Table of Contents
- [Microsoft Word AutoCorrect Abbreviation Import/Export Scripts](#ms_script)
    - [Files](#files)
    - [How to Use](#how_to_use)
    - [Dependencies](#dependencies)
    - [License](#license)

# Microsoft Word AutoCorrect Abbreviation Import/Export Scripts <a id="ms_script"></a>

The Microsoft Word AutoCorrect Abbreviation Import/Export Scripts repository contains two PowerShell scripts for importing and exporting Microsoft Word AutoCorrect abbreviations to/from a text file, as well as two batch scripts for executing the PowerShell scripts in a Windows environment. The scripts were developed with the goal of helping users manage their AutoCorrect abbreviations in Microsoft Word more efficiently.

## Files <a id="files"></a>

-   `ms-word-abbr-export.ps1`: This PowerShell script exports the AutoCorrect list from Microsoft Word to a text file. The output file name and path are stored in the `$OUTPUTFILE` variable, which is checked to ensure that the file does not already exist before the script runs.

-   `ms-word-abbr-import.ps1`: This PowerShell script reads a text file containing a list of Microsoft Word AutoCorrect abbreviations and their corresponding replacements, and then adds those entries to the AutoCorrect list in Word.

-   `ms-abbr-export.bat`: This batch script executes the `ms-word-abbr-export.ps1` PowerShell script in a Windows environment.

-   `ms-abbr-import.bat`: This batch script executes the `ms-word-abbr-import.ps1` PowerShell script in a Windows environment.

## How to Use <a id="how_to_use"></a>

To export the AutoCorrect list from Word, simply run the `ms-word-abbr-export.bat` batch script. The script will create a new text file in the same directory as the script, containing a list of AutoCorrect abbreviations and their replacements, and log the entries that were added to a file named `export-log.txt` in the same directory as the script.

To import a list of AutoCorrect abbreviations from a text file into Word, first create a text file containing a list of key-value pairs, with each pair separated by an equals sign (`=`) on a new line. Then, run the `ms-word-abbr-import.bat` batch script, and provide the path to the text file when prompted. The script will add the AutoCorrect entries to Word, and log the entries that were added to a file named `import-log.txt` in the same directory as the script.

## Dependencies <a id="dependencies"></a>

These scripts were developed and tested on Windows 10 with Microsoft Word 2016. They require PowerShell version 5 or later, which is included by default on Windows 10. If you are using an older version of Windows, you may need to install PowerShell separately.

## License <a id="license"></a>

These codes are released under the MIT License. Feel free to use, modify, and distribute them as needed.