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

const loopThroughRecordedPaths = () => {
    chrome.storage.sync.get(["recordedPaths"], function (result) {
        const recordedPaths = result.recordedPaths;
        const handleLoop = () => {
            for (var i = 0; i < recordedPaths.length; i++) {
                ((i) => {
                    setTimeout(function () {
                        findDomNodeFromXpath(
                            result.recordedPaths[i].xPath
                        ).click();
                    }, 1000 * i);
                })(i);
            }
        };
        handleLoop(recordedPaths);
    });
};
