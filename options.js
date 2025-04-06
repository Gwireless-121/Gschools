var isConfigured = false;

function getConfiguration(configPassword)
{
	chrome.runtime.sendMessage({type: "getConfiguration", password: configPassword});
}

function populateConfiguration(currentConfigJson)
{	
	var clientName = document.getElementById("clientName");
    var machineId = document.getElementById("machineId");
    var agentPassword = document.getElementById("agentPassword");
    var confirmAgentPassword = document.getElementById("confirmAgentPassword");
    
    var cloudConnectionCheckBox = document.getElementById("cloud_connection_checkbox");
    var reverseConnectionCheckBox = document.getElementById("reverse_connection_checkbox");
    
    var cloudAccount = document.getElementById("cloudAccount");

    var consoleHost_1 = document.getElementById("consoleHost_1");
    var consolePort_1 = document.getElementById("consolePort_1");
    var consolePassword_1 = document.getElementById("consolePassword_1");

    var consoleHost_2 = document.getElementById("consoleHost_2");
    var consolePort_2 = document.getElementById("consolePort_2");
    var consolePassword_2 = document.getElementById("consolePassword_2");

    var consoleHost_3 = document.getElementById("consoleHost_3");
    var consolePort_3 = document.getElementById("consolePort_3");
    var consolePassword_3 = document.getElementById("consolePassword_3");


    if (currentConfigJson != "")
    {
        var currentConfig = JSON.parse(currentConfigJson);

        clientName.value = currentConfig.clientName;
        machineId.value = currentConfig.machineId;
        agentPassword.value = currentConfig.localPassword;
        confirmAgentPassword.value = currentConfig.localPassword;
        
        if (currentConfig.cloudAccount)
        {
            cloudAccount.value = currentConfig.cloudAccount;
            cloudConnectionCheckBox.checked = true;
            setVisibleCloudConfiguration(true);
        }       

        if (currentConfig.reverseConnectionConfigs.length >= 1)
        {   
            reverseConnectionCheckBox.checked = true;
            reverseConnectionTypeChanged(); 
        } 
            
        if (currentConfig.reverseConnectionConfigs.length >= 1)
        {
            consoleHost_1.value = currentConfig.reverseConnectionConfigs[0].host;
            consolePort_1.value = currentConfig.reverseConnectionConfigs[0].port;
            consolePassword_1.value = currentConfig.reverseConnectionConfigs[0].password;
        }

        if (currentConfig.reverseConnectionConfigs.length >= 2)
        {
            showConsole2();
            consoleHost_2.value = currentConfig.reverseConnectionConfigs[1].host;
            consolePort_2.value = currentConfig.reverseConnectionConfigs[1].port;
            consolePassword_2.value = currentConfig.reverseConnectionConfigs[1].password;
        }

        if (currentConfig.reverseConnectionConfigs.length >= 3)
        {
            showConsole3();
            consoleHost_3.value = currentConfig.reverseConnectionConfigs[2].host;
            consolePort_3.value = currentConfig.reverseConnectionConfigs[2].port;
            consolePassword_3.value = currentConfig.reverseConnectionConfigs[2].password;
        }

		setVisibile("open_configuration", false);
        setVisibile("agent_configuration", true);
    }
    else
    {
        alert("Password is wrong!");
    }
}

function openConfiguration()
{
	if (isConfigured)
    {
        getConfiguration(document.getElementById("configurationPassword").value);
    }
    else
    {
        getConfiguration('');
    }
}


function saveConfiguration()
{
    var clientName = document.getElementById("clientName");
    var machineId = document.getElementById("machineId");
    var agentPassword = document.getElementById("agentPassword");
    var confirmAgentPassword = document.getElementById("confirmAgentPassword");
    
    var cloudConnectionCheckBox = document.getElementById("cloud_connection_checkbox");
    var reverseConnectionCheckBox = document.getElementById("reverse_connection_checkbox");
    
    var cloudAccount = document.getElementById("cloudAccount");
    var cloudAccountPassword = document.getElementById("cloudAccountPassword");

    var consoleHost_1 = document.getElementById("consoleHost_1");
    var consolePort_1 = document.getElementById("consolePort_1");
    var consolePassword_1 = document.getElementById("consolePassword_1");

    var consoleHost_2 = document.getElementById("consoleHost_2");
    var consolePort_2 = document.getElementById("consolePort_2");
    var consolePassword_2 = document.getElementById("consolePassword_2");

    var consoleHost_3 = document.getElementById("consoleHost_3");
    var consolePort_3 = document.getElementById("consolePort_3");
    var consolePassword_3 = document.getElementById("consolePassword_3");

    var console_2 = document.getElementById("console_2");
    var console_3 = document.getElementById("console_3");

    var config = new Object();

    config.localPassword = agentPassword.value;
    config.clientName = clientName.value;
    config.machineId = machineId.value;

    if (clientName.value.length < 3)
    {
        alert("Client Name must be minimum 3 characters long!");
        clientName.focus();
        return;
    }

    if (machineId.value.length < 12)
    {
        alert("Unique Computer Id (e.g. MAC Address) must be minimum 12 characters long!");
        machineId.focus();
        return;
    }

    if (agentPassword.value.length < 6)
    {
        alert("Agent Password must be minimum 6 characters long!");
        agentPassword.focus();
        return;
    }

    if (agentPassword.value != confirmAgentPassword.value)
    {
        alert("Agent Password and Confirm Agent Password must match!");
        agentPassword.value = "";
        confirmAgentPassword.value = "";
        agentPassword.focus();
        return;
    }
    
    if (!cloudConnectionCheckBox.checked && !reverseConnectionCheckBox.checked)
    {
        alert("Please select connection type.");
        cloudConnectionCheckBox.focus();
        return;
    }       
    
    if (cloudConnectionCheckBox.checked)
    {   
        if (cloudAccount.value.length < 1)
        {
            alert("Enter Cloud account!");
            cloudAccount.focus();
            return;
        }
        
        if (cloudAccountPassword.value.length < 1)
        {
            alert("Enter Cloud account password!");
            cloudAccountPassword.focus();
            return;
        }
        
        config.cloudAccount = cloudAccount.value;
        config.cloudAccountPassword = cloudAccountPassword.value;
    }   
     
    var reverseConnectionConfigs = new Array();

    if (isVisible(console_1) && reverseConnectionCheckBox.checked)
    {
        if (consoleHost_1.value.length < 3)
        {
            alert("Console Host must be minimum 3 characters long!");
            consoleHost_1.focus();
            return;
        }

        if (consolePassword_1.value.length < 6)
        {
            alert("Console Password must be minimum 6 characters long!");
            consolePassword_1.focus();
            return;
        }
        
        if (isNaN(consolePort_1.value))
        {
            alert("Enter a valid port number!");
            consolePort_1.focus();
            return;
        }        

        var reverseConnectionConfig_1 = new Object();
        reverseConnectionConfig_1.host = consoleHost_1.value
        reverseConnectionConfig_1.port = consolePort_1.value;
        reverseConnectionConfig_1.password = consolePassword_1.value
        reverseConnectionConfigs.push(reverseConnectionConfig_1);
    }

    if (isVisible(console_2))
    {
        if (consoleHost_2.value.length < 3)
        {
            alert("Console Host must be minimum 3 characters long!");
            consoleHost_2.focus();
            return;
        }

        if (consolePassword_2.value.length < 6)
        {
            alert("Console Password must be minimum 6 characters long!");
            consolePassword_2.focus();
            return;
        }
        
        if (isNaN(consolePort_2.value))
        {
            alert("Enter a valid port number!");
            consolePort_2.focus();
            return;
        }        

        var reverseConnectionConfig_2 = new Object();
        reverseConnectionConfig_2.host = consoleHost_2.value
        reverseConnectionConfig_2.port = consolePort_2.value;
        reverseConnectionConfig_2.password = consolePassword_2.value
        reverseConnectionConfigs.push(reverseConnectionConfig_2);
    }

    if (isVisible(console_3))
    {
        if (consoleHost_3.value.length < 3)
        {
            alert("Console Host must be minimum 3 characters long!");
            consoleHost_3.focus();
            return;
        }

        if (consolePassword_3.value.length < 6)
        {
            alert("Console Password must be minimum 6 characters long!");
            consolePassword_3.focus();
            return;
        }

        if (isNaN(consolePort_3.value))
        {
            alert("Enter a valid port number!");
            consolePort_3.focus();
            return;
        }        
        
        var reverseConnectionConfig_3 = new Object();
        reverseConnectionConfig_3.host = consoleHost_3.value
        reverseConnectionConfig_3.port = consolePort_3.value;
        reverseConnectionConfig_3.password = consolePassword_3.value
        reverseConnectionConfigs.push(reverseConnectionConfig_3);
    }

    config.reverseConnectionConfigs = reverseConnectionConfigs;

    var configJson = JSON.stringify(config);
	chrome.runtime.sendMessage({type: "saveConfiguration", configuration: configJson});
	isConfigured = true;
};

function finishConfiguration()
{
    setVisibile("open_configuration", true);
    setVisibile("agent_configuration", false); 
}   

function isVisible(visualElement)
{
    return visualElement.style.display === "block";
}

function setVisibile(visualElementId, visible)
{
    if (visible)
    {
        document.getElementById(visualElementId).style.display = "block";
    }
    else
    {
        document.getElementById(visualElementId).style.display = "none";
    }
}

function setVisibleConsole1(visible)
{
    var consoleHost_1 = document.getElementById("consoleHost_1");
    
    setVisibile("console_1", document.getElementById("reverse_connection_checkbox").checked);
    
    if (visible)
    {   
        consoleHost_1.focus();
    }
}

function setVisibleConsole2(visible)
{
    var consolePort_1 = document.getElementById("consolePort_1");
    var consoleHost_2 = document.getElementById("consoleHost_2");
    var consolePort_2 = document.getElementById("consolePort_2");
    
    setVisibile("console_no_1", visible);
    setVisibile("console_2", visible);
    setVisibile("remove_console_2_button", visible);
    setVisibile("add_console_2_button", !visible);
    
    if (visible)
    {   
        consoleHost_2.focus();
    }
    
    if (consolePort_2.value === "")
    {
        consolePort_2.value = consolePort_1.value;
    }
}

function setVisibleConsole3(visible)
{
    var consolePort_2 = document.getElementById("consolePort_2");
    var consoleHost_3 = document.getElementById("consoleHost_3");
    var consolePort_3 = document.getElementById("consolePort_3");
    var console_2 = document.getElementById("console_2");
    
    setVisibile("console_no_2", visible);
    setVisibile("console_3", visible);
    setVisibile("remove_console_3_button", visible);
    setVisibile("add_console_3_button", !visible);
    setVisibile("remove_console_2_button", !visible && isVisible(console_2));
    
    if (visible)
    {   
        consoleHost_3.focus();
    }
    
    if (consolePort_3.value === "")
    {
        consolePort_3.value = consolePort_2.value;
    }
}

function showConsole2()
{
    setVisibleConsole2(true);
}   

function hideConsole2()
{
    setVisibleConsole2(false);
}

function showConsole3()
{
    setVisibleConsole3(true);
}   

function hideConsole3()
{
    setVisibleConsole3(false);
}

function setVisibleCloudConfiguration(visible)
{
    setVisibile("cloudConfiguration", visible);
}

function cloudConnectionTypeChanged()
{
    setVisibleCloudConfiguration(document.getElementById("cloud_connection_checkbox").checked);
}   

function reverseConnectionTypeChanged()
{
    var visible = document.getElementById("reverse_connection_checkbox").checked;
    setVisibleConsole1(visible);
    setVisibleConsole2(false);
    setVisibleConsole3(false);    
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
  if (request.type === 'initOptionsPage') 
  {
	document.getElementById("application_name").innerHTML = request.applicationName + ' Options';
	isConfigured = request.isConfigured;
	
	if (!isConfigured)
	{		
		setVisibile("open_configuration", false);
		setVisibile("agent_configuration", true);
		getConfiguration("");
		document.getElementById("agentPassword").focus();
	}
	else
	{
	    setVisibile("open_configuration", true);
		setVisibile("agent_configuration", false);
		document.getElementById("configurationPassword").innerHTML = '';
		document.getElementById("configurationPassword").focus();
	}
  }
  else if (request.type === 'sendConfiguration') 
  {
	populateConfiguration(request.configuration);
  }
  else if (request.type === 'finishConfiguration') 
  {
	finishConfiguration();
  }
});

chrome.runtime.sendMessage({type: "optionsPageStarted"});

document.getElementById("open_button").onclick = openConfiguration;
document.getElementById("save_button").onclick = saveConfiguration;
document.getElementById("add_console_2_button").onclick = showConsole2;
document.getElementById("remove_console_2_button").onclick = hideConsole2;
document.getElementById("add_console_3_button").onclick = showConsole3;
document.getElementById("remove_console_3_button").onclick = hideConsole3;
document.getElementById("cloud_connection_checkbox").onclick = cloudConnectionTypeChanged;
document.getElementById("reverse_connection_checkbox").onclick = reverseConnectionTypeChanged;


