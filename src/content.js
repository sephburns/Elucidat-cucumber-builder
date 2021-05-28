const recordedPaths = [];
const recordedTarget = [];
let recordingInput = false;
let previousSelectedItem = null;
let previewBox;
let isReplaying = false;

// Inject the template HTML at the top of the page
fetch(chrome.runtime.getURL("/preview.html"))
    .then((r) => r.text())
    .then((html) => {
        document.body.insertAdjacentHTML("beforebegin", html);
    })
    .then(() => {
        previewBox = document.getElementById("cucumber-preview-box");
        pushUiElementIds();
    });

const handleMouseOver = (event) => {
    const tagName = getTagName(event);
    if (isAllowedTag(tagName) && !recordingInput && !isReplaying) {
        if (previousSelectedItem) {
            previousSelectedItem.classList.remove("cucumber_selected");
        }
        event.target.classList.add("cucumber_selected");
        previousSelectedItem = event.target;
        if (previewBox) {
            previewBox.innerText = tagName;
        }
    }
};

const handleMouseDown = (event) => {
    let mainTarget = event.target;
    let tagName = getTagName(event);
    if (!isAllowedTag(tagName)) {
        mainTarget = closest(event.target, "div");
        tagName = "div";
    }
    if (!recordingInput && !isReplaying) {
        chrome.storage.sync.get(["recording"], function (result) {
            const isRecording = result.recording;
            if (isRecording) {
                saveToLocal("clicked", getPathTo(mainTarget), "", tagName);
                if (tagName === "input") {
                    previewBox.innerText = "...recording input";
                    recordingInput = true;
                }
            }
        });
    }
};

const handleKeyPress = debounce((event) => {
    chrome.storage.sync.get(["recording"], (result) => {
        const isRecording = result.recording;
        const tagName = getTagName(event);
        if (tagName === "input" && isRecording) {
            saveToLocal(
                "entered_text",
                getPathTo(event.target),
                event.target.value,
                tagName
            );
            console.log("recordedPaths", recordedPaths);
            previewBox.innerText = "saved!";
            recordingInput = false;
        }
    });
}, 2000);
