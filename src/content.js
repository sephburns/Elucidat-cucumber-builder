const recordedPaths = [];
const recordedTarget = [];
let recordingInput = false;
let previousSelectedItem = null;

// Inject the template HTML at the top of the page
fetch(chrome.runtime.getURL("/preview.html"))
    .then((r) => r.text())
    .then((html) => {
        document.body.insertAdjacentHTML("beforebegin", html);
    });

document.addEventListener("mousedown", function (event) {
    const tagName = getTagName(event);
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
            }
            console.log("recordedPaths", recordedPaths);
            if (tagName === "input") {
                previewBox.innerText = "...recording input";
                recordingInput = true;
            }
        });
    }
});

document.addEventListener(
    "keypress",
    debounce((event) => {
        const tagName = getTagName(event);
        if (tagName === "input") {
            recordedPaths.push(
                new Path(
                    "entered_text",
                    event.target,
                    getPathTo(event.target),
                    event.target.value,
                    tagName
                )
            );
            previewBox.innerText = "saved!";
            recordingInput = false;
        }
    }, 2000)
);

document.addEventListener("mouseover", function (event) {
    const tagName = getTagName(event);
    if (isAllowedTag(tagName) && !recordingInput) {
        previousSelectedItem &&
            previousSelectedItem.classList.remove("cucumber_selected");
        event.target.classList.add("cucumber_selected");
        previousSelectedItem = event.target;
        previewBox = document.getElementById("cucumber-preview-box");
        previewBox.innerText = tagName;
    }
});
