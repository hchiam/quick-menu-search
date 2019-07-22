chrome.tabs.executeScript(null, { file: 'brain.js' });
setTimeout(() => {
  window.close();
}, 1000);