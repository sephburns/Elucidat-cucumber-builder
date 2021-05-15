const recordedPaths = [];
const recordedTarget = [];
let previousSelectedItem = null;

function getPathTo(element) {
    if (element.id !== "") return `//*[@id="${element.id}"]`;
    if (element === document.body) return "//body";

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return (
                getPathTo(element.parentNode) +
                "/" +
                element.tagName +
                "[" +
                (ix + 1) +
                "]"
            );
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
}

document.addEventListener("mousedown", function (event) {
    chrome.storage.sync.get(["recording"], function (result) {
        const isRecording = result.recording;
        const tagName = event.path[0].tagName.toLowerCase();
        if (isRecording) {
            recordedPaths.push({
                eventType: "clicked",
                target: event.target,
                xPath: getPathTo(event.target),
                value: "",
                tagName: tagName,
            });
        }
        console.log("recordedPaths", recordedPaths);
        if (tagName === "input") {
            var searchTimeout;
            event.target.addEventListener("keypress", (event) => {
                if (isRecording) {
                    if (searchTimeout != undefined) {
                        clearTimeout(searchTimeout);
                    }
                    searchTimeout = setTimeout(callServerScript, 4000);
                    function callServerScript() {
                        recordedPaths.push({
                            eventType: "entered_text",
                            target: event.target,
                            xPath: getPathTo(event.target),
                            value: event.target.value,
                            tagName: tagName,
                        });
                        console.log("recordedPaths", recordedPaths);
                    }
                }
            });
        }
    });
});

const isAllowedTag = (tag) => {
    const allowedTags = [
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "button",
        "input",
        "a",
        "p",
    ];
    return allowedTags.indexOf(tag) !== -1;
};

document.addEventListener("mouseover", function (event) {
    const tagName = event.path[0].tagName.toLowerCase();
    const tagString = `cucumber_selected_${tagName}`;
    if (isAllowedTag(tagName)) {
        previousSelectedItem &&
            document
                .getElementsByClassName(previousSelectedItem)[0]
                .classList.remove(previousSelectedItem);
        event.target.classList.add(tagString);
        previousSelectedItem = tagString;
    }
});
