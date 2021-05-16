document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "clearLocalPaths") {
        clearLocalPaths();
    }
});

document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "replay") {
        handleReplay();
    }
});
