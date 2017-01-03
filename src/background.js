//########## Messaging
chrome.runtime.onConnect.addListener(p => {
    closeAruTab();
    port = p;
    p.onMessage.addListener((msg) => {
        switch (msg.message) {
            case "getTabs":
                chrome.tabs.getAllInWindow(null, (tabs) => {
                    p.postMessage({ "message": "getTabs", "tabs": tabs });
                });
                break;
            case "getWindows":
                chrome.windows.getAll({ populate: true }, wins =>{
                    p.postMessage({ "message": "getWindows", "wins": wins })});
                break;
            case "changeTab":
                chrome.tabs.update(msg.tabId, { active: true });
                closeAruTab();
                break;
            case "closeTab":
                chrome.tabs.remove([msg.tabId]);
                break;
            case "closeAruTab":
                closeAruTab();
                break;
        }
    });
    p.onDisconnect.addListener(
        () => port = null
    );
})

//########## TabThumb
let port = null;
let captureTabTimer = null;
function capture(tabId) {
    if (captureTabTimer) clearTimeout(captureTabTimer);
    captureTabTimer = setTimeout(() => {
        chrome.tabs.captureVisibleTab(null, { "format": "jpeg" }, capt => {
            chrome.windows.getCurrent(win => chrome.tabs.getSelected(win.id, tab => {    //check is the same tab;
                if (tab.id == tabId) reductionImage(capt, tabId);
            }))
        })
    }, 1000);
}

function reductionImage(source, id) {
    var img = new Image();
    img.onload = () => {
        const can = document.createElement("canvas");
        can.width = img.width / 2;
        can.height = img.height / 2;
        const ctx = can.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, can.width, can.height);
        let obj = {};
        obj[id] = can.toDataURL();
        chrome.storage.local.set(obj, () => { });
    };

    img.src = source;
}

//########## tabs events
function updatedTabs() {
    if (port) port.postMessage({ "message": "updateTabList" })
}

function closeAruTab() {
    if (port) chrome.tabs.sendMessage(port.sender.tab.id, { "message": "closeAruTab" });
}

chrome.tabs.onActivated.addListener((info) => {
    capture(info.tabId);
    closeAruTab();
});
chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    if (changeInfo.status) capture(id);
    updatedTabs();
});
chrome.tabs.onRemoved.addListener((id, _) => {
    chrome.storage.remove(id);
    updatedTabs();
});
chrome.tabs.onReplaced.addListener((add, remove) => {
    chrome.storage.remove(remove);
    updatedTabs();
});
chrome.tabs.onCreated.addListener((add) => {
    updatedTabs();
});
