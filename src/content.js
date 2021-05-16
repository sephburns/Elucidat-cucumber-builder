const recordedPaths = [];
const recordedTarget = [];
let recordingInput = false;
let previousSelectedItem = null;
let previewBox;

// Inject the template HTML at the top of the page
fetch(chrome.runtime.getURL("/preview.html"))
    .then((r) => r.text())
    .then((html) => {
        document.body.insertAdjacentHTML("beforebegin", html);
    })
    .then(() => {
        previewBox = document.getElementById("cucumber-preview-box");
    });

document.addEventListener("mouseover", function (event) {
    const tagName = getTagName(event);
    if (isAllowedTag(tagName) && !recordingInput) {
        previousSelectedItem &&
            previousSelectedItem.classList.remove("cucumber_selected");
        event.target.classList.add("cucumber_selected");
        previousSelectedItem = event.target;
        if (previewBox) {
            previewBox.innerText = tagName;
        }
    }
});

document.addEventListener("mousedown", function (event) {
    const tagName = getTagName(event);
    // if (!isAllowedTag(tagName)) {
    //     console.log(closest(event.target, "div"));
    // }
    if (isAllowedTag(tagName) && !recordingInput) {
        chrome.storage.sync.get(["recording"], function (result) {
            const isRecording = result.recording;
            const tagName = event.path[0].tagName.toLowerCase();
            if (isRecording) {
                recordedPaths.push(
                    new Path(
                        "clicked",
                        event.target,
                        getPathTo(event.target),
                        "",
                        tagName
                    )
                );
                playConfirmationSound();
                console.log("recordedPaths", recordedPaths);
                if (tagName === "input") {
                    previewBox.innerText = "...recording input";
                    recordingInput = true;
                }
            }
        });
    }
});

document.addEventListener(
    "keypress",
    debounce((event) => {
        chrome.storage.sync.get(["recording"], (result) => {
            const isRecording = result.recording;
            const tagName = getTagName(event);
            if (tagName === "input" && isRecording) {
                recordedPaths.push(
                    new Path(
                        "entered_text",
                        event.target,
                        getPathTo(event.target),
                        event.target.value,
                        tagName
                    )
                );
                playConfirmationSound();
                console.log("recordedPaths", recordedPaths);
                previewBox.innerText = "saved!";
                recordingInput = false;
            }
        });
    }, 2000)
);
