const isAllowedTag = (queryTag) => {
    const allowedTags = tagTypes.map((tag) => {
        return tag.tagName;
    });
    return allowedTags.indexOf(queryTag) !== -1;
};

const getPathTo = (element) => {
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
};

const getTagName = (event) => {
    return event.path[0].tagName.toLowerCase();
};

const debounce = (func, wait, immediate) => {
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
};

const closest = (el, selector) => {
    var matchesFn;

    // find vendor prefix
    [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector",
    ].some(function (fn) {
        if (typeof document.body[fn] == "function") {
            matchesFn = fn;
            return true;
        }
        return false;
    });

    var parent;

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
    chrome.storage.sync.get(["recordedPaths"], function (result) {
        const previousPaths = result.recordedPaths ?? [];
        const newPaths = [
            ...previousPaths,
            new Path(action, xPath, targetValue, tagName),
        ];
        chrome.storage.sync.set({
            recordedPaths: newPaths,
        });

        clearCurrentActions();

        addActionsToCurrentActions(newPaths.map(action => action.xPath))
    });
};

const clearLocalPaths = () => {
    chrome.storage.sync.set({
        recordedPaths: [],
    });

    clearCurrentActions();
};

const handleCommit = () => {
    const name = prompt('Please name the new test');

    if (name) {
        chrome.storage.sync.get(["recordedPaths"], function (result) {
            const paths = result.recordedPaths ?? [];

            createTest({
                    name,
                    body: JSON.stringify(paths)
                })
                .then(() => {
                    alert(`Test ${name} created!`);
                    refreshTestsSelect(true)
                    clearLocalPaths();
                })
                .catch(() => {
                    alert(`Test ${name} could not be created`);
                })
        });
    } else {
        alert('Invalid name');
    }
};


const refreshTestsSelect = (isInited = false) => {
    getTests()
        .then(tests => {
            console.log(tests);
            const container = document
                .getElementById('tests-select-container');

            const select = document
                .getElementById('tests-select');

            select.options.length = 0;

            tests.forEach(test => {
                container
                    .classList
                    .remove('hidden');

                select.add(
                    (() => {
                        const option = document.createElement('option');

                        option.text = test.name ?? 'NO_NAME';

                        option.value = test.id;

                        return option;
                    })()
                )
            })

            if(!isInited){
                select
                    .addEventListener("change", (event) => {
                        if (event.target.value) {
                            getTest(event.target.value)
                                .then(test => {
                                    clearCurrentActions();

                                    addActionsToCurrentActions(test.body.map(action => action.xPath))
                                })
                        }
                    });
            }
        })
}

const addActionToCurrentActions = action => {
    const el = document.createElement('li');

    el.appendChild(
        document.createTextNode(action)
    );

    document.getElementById('current-actions').appendChild(el);
}

const clearCurrentActions = () => document.getElementById('current-actions').innerHTML = '';

const addActionsToCurrentActions = actions => actions.forEach(action => addActionToCurrentActions(action));