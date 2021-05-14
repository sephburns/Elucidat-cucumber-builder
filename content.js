document.addEventListener("mousedown", function (event) {
    chrome.storage.sync.get(["recording"], function (result) {
        const isRecording = result.recording;
        if (isRecording) {
            console.log(event.path);
        }
    });
});
