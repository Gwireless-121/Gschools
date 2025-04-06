// Load saved chat state when content script runs
chrome.storage.sync.get("chatEnabled", (data) => {
    updateChatBubble(data.chatEnabled || false);
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.enabled !== undefined) {
        updateChatBubble(message.enabled);
    }
});

// Function to show/hide the chat bubble
function updateChatBubble(enabled) {
    if (enabled) {
        if (!document.getElementById("chatIcon")) {
            let chatIcon = document.createElement("div");
            chatIcon.id = "chatIcon";
            chatIcon.style.position = "fixed";
            chatIcon.style.bottom = "20px";
            chatIcon.style.right = "20px";
            chatIcon.style.width = "60px";
            chatIcon.style.height = "60px";
            chatIcon.style.cursor = "pointer";
            chatIcon.style.borderRadius = "50%";
            chatIcon.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
            chatIcon.style.zIndex = "1000";
            chatIcon.style.fontSize = "40px";
            chatIcon.style.backgroundImage = `url(${chrome.runtime.getURL("bubble-icon.png")})`;
            chatIcon.style.backgroundSize = "contain";  
            chatIcon.style.backgroundPosition = "center";  
            chatIcon.style.backgroundRepeat = "no-repeat";           
            document.body.appendChild(chatIcon);

            chatIcon.addEventListener("click", () => {
                if (!document.getElementById("chatBubble")) {
                    let chatBubble = document.createElement("div");
                    chatBubble.id = "chatBubble";
                    chatBubble.style.position = "absolute"; 
                    chatBubble.style.left = "70%";  
                    chatBubble.style.top = "70%";  
                    chatBubble.style.width = "350px";
                    chatBubble.style.height = "400px";
                    chatBubble.style.backgroundColor = "white";
                    chatBubble.style.border = "1px solid #ccc";
                    chatBubble.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
                    chatBubble.style.borderRadius = "10px";
                    chatBubble.style.zIndex = "1001";
                    
                    // DRAG HANDLE (Top bar for easy dragging)
                    let dragHandle = document.createElement("div");
                    dragHandle.style.width = "100%";
                    dragHandle.style.height = "30px";
                    dragHandle.style.background = "#ddd";
                    dragHandle.style.borderTopLeftRadius = "10px";
                    dragHandle.style.borderTopRightRadius = "10px";
                    dragHandle.style.cursor = "grab";
                    dragHandle.style.display = "flex";
                    dragHandle.style.alignItems = "center";
                    dragHandle.style.justifyContent = "center";
                    dragHandle.style.fontWeight = "bold";
                    dragHandle.innerText = "Drag Me";

                    let closeButton = document.createElement("button");
                    closeButton.innerText = "X";
                    closeButton.style.position = "absolute";
                    closeButton.style.top = "5px";
                    closeButton.style.right = "5px";
                    closeButton.style.border = "none";
                    closeButton.style.background = "red";
                    closeButton.style.color = "white";
                    closeButton.style.width = "25px";
                    closeButton.style.height = "25px";
                    closeButton.style.borderRadius = "50%";
                    closeButton.style.cursor = "pointer";

                    closeButton.addEventListener("click", () => {
                        chatBubble.remove();
                    });

                    let iframe = document.createElement("iframe");
                    iframe.src = "https://graden-mcclures-team.adalo.com/g-school";  // Replace with your chat URL
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.style.border = "none";
                    iframe.style.borderRadius = "0px 0px 10px 10px"; // Rounded bottom corners

                    chatBubble.appendChild(dragHandle);
                    chatBubble.appendChild(closeButton);
                    chatBubble.appendChild(iframe);
                    document.body.appendChild(chatBubble);

                    // Enable Dragging via Drag Handle
                    enableDrag(chatBubble, dragHandle);
                }
            });
        }
    } else {
        let chatIcon = document.getElementById("chatIcon");
        if (chatIcon) chatIcon.remove();

        let chatBubble = document.getElementById("chatBubble");
        if (chatBubble) chatBubble.remove();
    }
}

// Function to make chat bubble draggable using the handle
function enableDrag(element, dragHandle) {
    let offsetX, offsetY, isDragging = false;

    dragHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        dragHandle.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        dragHandle.style.cursor = "grab";
    });
}