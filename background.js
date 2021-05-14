let recording = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ recording });
});
