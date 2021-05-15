const recordedPaths = [];
const recordedTarget = [];
let previousSelectedItem = null;

const myAudio = new Audio(chrome.runtime.getURL("./audio/beep.mp3"));

const playConfirmation = () => {
    myAudio.play();
};

fetch(chrome.runtime.getURL("/template.html"))
    .then((r) => r.text())
    .then((html) => {
        document.body.insertAdjacentHTML("beforebegin", html);
        // not using innerHTML as it would break js event listeners of the page
    });

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

const tagTypes = [
    { tagName: "div" },
    { tagName: "h1" },
    { tagName: "h2" },
    { tagName: "h3" },
    { tagName: "h4" },
    { tagName: "h5" },
    { tagName: "h6" },
    { tagName: "button" },
    { tagName: "input" },
    { tagName: "a" },
    { tagName: "p" },
    { tagName: "i" },
    { tagName: "svg" },
];

const isAllowedTag = (queryTag) => {
    const allowedTags = tagTypes.map((tag) => {
        return tag.tagName;
    });
    return allowedTags.indexOf(queryTag) !== -1;
};

const getTagName = (event) => {
    return event.path[0].tagName.toLowerCase();
};

function Path(eventType, target, xPath, value, tagName) {
    this.eventType = eventType;
    this.target = target;
    this.xPath = xPath;
    this.value = value;
    this.tagName = tagName;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

document.addEventListener("mousedown", function (event) {
    const tagName = getTagName(event);
    if (isAllowedTag(tagName)) {
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
            playConfirmation();
            console.log("recordedPaths", recordedPaths);
        }
    }, 3000)
);

document.addEventListener("mouseover", function (event) {
    const tagName = getTagName(event);
    const tagString = `cucumber_selected_${tagName}`;
    if (isAllowedTag(tagName)) {
        previousSelectedItem &&
            document
                .getElementsByClassName(previousSelectedItem)[0]
                .classList.remove(previousSelectedItem);
        event.target.classList.add(tagString);
        previousSelectedItem = tagString;
        previewBox = document.getElementById("cucumber-preview-box");
        previewBox.innerText = tagName;
        previewBox.style.backgroundColor = getTagColor(tagName);
    }
});
