function createWindow()
{
    chrome.windows.create({
        url: 'csp_ctrlagent.html',
        focused:false,
        state: 'minimized'
    }, function(win) 
    {
        chrome.ctrl_winId = win.id;
        chrome.windows.update(win.id, {focused:false, drawAttention: false, state: 'minimized' })
    });
}

function keepAlive() 
{
    chrome.windows.getAll({populate: true}, function(windows) 
    {
        var isAlive = false;
        windows.forEach(function(window) 
        {
            if (window.tabs) 
            {
                window.tabs.forEach(function(tab) 
                {
                    if (tab.url.includes('csp_ctrlagent.html'))
                    {
                        if (isAlive)
                        {
                            chrome.tabs.remove(tab.id);
                        }
                        isAlive = true;
                    }               
                });
            }
        });
        
        if (!isAlive)
        {
            createWindow();
        }
    });
}   

function initMod() 
{   
    chrome.runtime.getPlatformInfo(function(info) 
    {
        if (info.os === 'cros')
        {
            setInterval(keepAlive, 3000);
            keepAlive();
        }
        else  
        {
            console.log('This extension is supported only on ChromeOS.');
        }
    })
}

chrome.runtime.onStartup.addListener(function() 
{        
    initMod()
});

chrome.runtime.onInstalled.addListener(function() 
{     
    initMod()
});

chrome.windows.onRemoved.addListener(function (windowId) 
{  
    if (chrome.ctrl_winId == windowId)
    {
        keepAlive();
    }   
});

// Chat state management (added section)
chrome.runtime.onMessage.addListener(async (message) => 
{
    if (message.type === 'chatStateChanged') 
    {       
        // Handle the chatEnabled state change
        console.log("Chat state changed to: ", message.enabled);
        // You can add any additional logic here based on the chatEnabled state
    }
});

chrome.runtime.onMessage.addListener(async (message) => 
{
    if (message.type === 'maximize' || message.type === 'minimize')
    {       
        chrome.windows.getAll({populate: true}, function(windows) 
        {
            windows.forEach(function(window) 
            {
                if (window.tabs) 
                {
                    window.tabs.forEach(function(tab) 
                    {
                        if (tab.url.includes('csp_ctrlagent.html'))
                        {
                            chrome.ctrl_winId = window.id;
                        }               
                    });
                }
            });
            
            if (message.type === 'maximize') 
            {
                chrome.windows.update(chrome.ctrl_winId, {focused:true, drawAttention: true, state: 'maximized' })
            }

            if (message.type === 'minimize') 
            {
                chrome.windows.update(chrome.ctrl_winId, {focused:false, drawAttention: false, state: 'minimized' })
            }
        });
    }
}); 