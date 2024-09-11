chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: getCurrentTabUrl,
    });
  });
});

function getCurrentTabUrl() {
  console.log(window.location.href);
}
