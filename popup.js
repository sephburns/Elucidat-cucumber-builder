// When the button is clicked, inject startRecording into current page
document.getElementById("record").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startRecording,
    });
});

document.getElementById("stop-record").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: stopRecording,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function startRecording() {
    chrome.storage.sync.set({ recording: true });
}

function stopRecording() {
    chrome.storage.sync.set({ recording: false });
}
