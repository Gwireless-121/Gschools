document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleChat");

    // Load saved setting
    chrome.storage.sync.get("chatEnabled", (data) => {
        toggle.checked = data.chatEnabled || false;
    });

    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;

        // Save state in Chrome storage
        chrome.storage.sync.set({ chatEnabled: enabled }, () => {
            console.log("Chat enabled state saved:", enabled);

            // Send message to content script on all **valid** tabs
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    // ✅ Only send message if tab has a valid URL
                    if (tab.id && tab.url && tab.url.startsWith("http")) {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ["content.js"]
                        }, () => {
                            chrome.tabs.sendMessage(tab.id, { enabled });
                        });
                    }
                });
            });
        });
    });
});