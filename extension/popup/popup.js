// Add an event listener to the "Go to options" button
document.querySelector('#go-to-options').addEventListener('click', function() {
  console.log(`Popup Script : Go to options`);
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});