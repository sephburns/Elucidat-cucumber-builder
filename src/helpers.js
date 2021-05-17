const myAudio = new Audio(chrome.runtime.getURL("../audio/beep.mp3"));

const playConfirmationSound = () => {
    myAudio.play();
};

const isAllowedTag = (queryTag) => {
    const allowedTags = tagTypes.map((tag) => {
        return tag.tagName;
    });
    return allowedTags.indexOf(queryTag) !== -1;
};

const getPathTo = (element) => {
    if (element.id !== "") return `//*[@id="${element.id}"]`;
    if (element === document.body) return "//body";
    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
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
};

const getTagName = (event) => {
    return event.path[0].tagName.toLowerCase();
};

const debounce = (func, wait, immediate) => {
    let timeout;
    return () => {
        const context = this,
            args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const closest = (el, selector) => {
    console.log("el", el);
    let matchesFn;
    // find vendor prefix
    [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector",
    ].some((fn) => {
        if (typeof document.body[fn] == "function") {
            matchesFn = fn;
            return true;
        }
        return false;
    });
    let parent;
    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }
    return null;
};

function Path(eventType, xPath, value, tagName) {
    this.eventType = eventType;
    this.xPath = xPath;
    this.value = value;
    this.tagName = tagName;
}

const saveToLocal = (action, xPath, targetValue, tagName) => {
    chrome.storage.sync.get(["recordedPaths"], (result) => {
        const previousPaths = result.recordedPaths;
        const newPaths = [
            ...previousPaths,
            new Path(action, xPath, targetValue, tagName),
        ];
        console.log("Save to local", newPaths);
        chrome.storage.sync.set({
            recordedPaths: newPaths,
        });
    });
};

const clearLocalPaths = () => {
    chrome.storage.sync.set({
        recordedPaths: [],
    });
};
