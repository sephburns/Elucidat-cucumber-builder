let recording = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ recording });
});
