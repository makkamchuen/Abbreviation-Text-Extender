// Create the table
const table = document.getElementById('my-table');
const tbody = table.querySelector('tbody');
var global_data;

// Initialize the option page
document.addEventListener('DOMContentLoaded', function () {
  console.log('Option Script : DOMContentLoaded event fired');
  loadDataFromStorage();
});

function loadDataFromStorage() {
  chrome.storage.sync.get(null, function (items) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }

    global_data = new Map();
    for (const key in items) {
      global_data.set(key, items[key]);
    }
    
    console.log("Option Script : Data Load from Storage", global_data);
    renderTable(global_data);
  });
}

function renderTable(data) {
  tbody.innerHTML = '';
  data.forEach((value, key) => {
    const row = tbody.insertRow();
    const keyCell = row.insertCell(0);
    const valueCell = row.insertCell(1);
    const actionCell = row.insertCell(2);
    keyCell.innerHTML = key;
    valueCell.innerHTML = value;
    actionCell.innerHTML = '<button class="delete-btn">Delete</button>';
    actionCell.querySelector('.delete-btn').addEventListener('click',
      () => {
        // Update the data in the view
        data.delete(key);
        renderTable(data);

        // Update the record in the storage
        global_data.delete(key)
        deleteKey(key)
      }
    );
  });
}

// Import data from Text file
const importBtn = document.getElementById('import-btn');
const importFileLinkInput = document.getElementById('import-file-link-input');

importBtn.addEventListener('click', () => {
  const fileLink = importFileLinkInput.value.trim();
  if (fileLink) {
    fetch(fileLink)
      .then(response => response.text())
      .then(textData => importDataFromTextFile(textData))
      .catch(error => console.error(error));
  }
});

// Import data from Text file
function importDataFromTextFile(inputText) {
  // Split the input text into lines
  const lines = inputText.trim().split(/\r?\n/);

  lines.forEach(line => {
    const [key, value] = line.split('=').map(str => str.trim());
    global_data.set(key, value);
    saveData(key, value);
  });

  console.log("Option Script : Import Data from text file", global_data);
  renderTable(global_data);
}

// Open an file explorer to import data from Text file
// By default, <input type="file" id="browse-file-input"/> is not keyboard accessible
// I can workaround it via creating a keyboard accessible button to trigger a click event to the hidden file input
const browserBtn = document.getElementById('browse-btn');
const browserFileInput = document.getElementById('browse-file-input');

browserBtn.addEventListener('click', () => {
  browserFileInput.click();
});

browserFileInput.addEventListener('change', () => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    importDataFromTextFile(fileReader.result);
  };
  fileReader.readAsText(browserFileInput.files[0]);
});

// Add or modify key-value pair
const addRowBtn = document.getElementById('add-row-btn');
addRowBtn.addEventListener('click', () => {
  const key = document.getElementById('replace-key-input').value;
  const value = document.getElementById('replace-value-input').value;
  global_data.set(key, value);
  saveData(key, value);
  renderTable(global_data);
});

// Search and filter
function filterData() {
  const searchTextKey = document.getElementById('replace-key-input').value.toLowerCase();
  const filteredData = new Map();
  
  global_data.forEach((value, key) => {
    if (key.toLowerCase().includes(searchTextKey)) {
      filteredData.set(key, value);
    }
  });
  
  renderTable(filteredData);
}

document.getElementById('replace-key-input').addEventListener('input', () => {
  filterData();
});

// Get the clear filter button and search input fields 
const clearFilterBtn = document.getElementById('clear-filter-btn');
const replaceKeyInput = document.getElementById('replace-key-input');
const replaceValueInput = document.getElementById('replace-value-input');

// Add event listener to clear filter button
clearFilterBtn.addEventListener('click', () => {
  // Clear the search input fields
  replaceKeyInput.value = '';
  replaceValueInput.value = '';
  // Reset the table to show all rows
  renderTable(global_data);
});

// Save changes
function saveData(key, value) {
  chrome.storage.sync.set({ [key]: value }, function () {
    console.log(`Option Script : Key '${key}' has been updated in storage with value '${value}'`);
  });
}

// Delete a key
function deleteKey(key) {
  chrome.storage.sync.remove(key, function() {
    console.log(`Option Script : Key '${key}' has been deleted from storage`);
  });
}

function clearAllData() {
  if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
    chrome.storage.sync.clear(function () {
      console.log('Option Script : All data has been cleared from storage.');
    });
  }
}