const findDomNodeFromXpath = (xPath) => {
    var xPathRes = document.evaluate(
        xPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return xPathRes.singleNodeValue;
};

const handleReplay = () => {
    chrome.storage.sync.get(["recordedPaths"], function (result) {
        loopThroughRecordedPaths(result.recordedPaths);
    });
};

function loopThroughRecordedPaths(paths) {
    for (var i = 0; i < paths.length; i++) {
        // for each iteration console.log a word
        // and make a pause after it
        (function (i) {
            setTimeout(function () {
                console.log(paths[i]);
            }, 1000 * i);
        })(i);
    }
}
