const getTab = async () => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return tab.id;
};

// When the button is clicked, inject startRecording into current page
document.getElementById("record").addEventListener("mousedown", async () => {
    chrome.scripting.executeScript({
        target: { tabId: await getTab() },
        function: setRecording(true),
    });
});

document
    .getElementById("stop-record")
    .addEventListener("mousedown", async () => {
        chrome.scripting.executeScript({
            target: { tabId: await getTab() },
            function: setRecording(false),
        });
    });

document
    .getElementById("commit-code")
    .addEventListener("mousedown", async () => {
        chrome.scripting.executeScript({
            target: { tabId: await getTab() },
            function: commitCode,
        });
    });

// The body of this function will be executed as a content script inside the
// current page
function setRecording(bool) {
    chrome.storage.sync.set({ recording: bool });
}
