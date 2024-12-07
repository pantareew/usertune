// When the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  console.log("UserTune extension installed.");
  applySettingsToAllTabs();
});

// Listen for messages to apply settings
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "applySettings") {
    // Store the new settings
    chrome.storage.local.set({ settings: request.settings }, function () {
      if (chrome.runtime.lastError) {
        console.error("Failed to save settings:", chrome.runtime.lastError);
        return;
      }
      console.log("Settings saved.");
      // Apply settings to all open tabs
      applySettingsToAllTabs();
    });
  }
});

function applySettingsToAllTabs() {
  chrome.storage.local.get("settings", function (data) {
    if (chrome.runtime.lastError || !data.settings) {
      console.error("Failed to retrieve settings:", chrome.runtime.lastError);
      return;
    }
    const settings = data.settings;

    // Query all open tabs and inject the content script
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"],
          },
          function () {
            if (chrome.runtime.lastError) {
              console.error(
                "Script injection failed:",
                chrome.runtime.lastError
              );
              return;
            }
            // Send the settings to the content script
            chrome.tabs.sendMessage(tab.id, {
              action: "applySettings",
              settings: settings,
            });
          }
        );
      });
    });
  });
}

// Listen for tab updates (e.g., new tabs or page reloads)
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    // Tab finished loading, apply the settings
    applySettingsToTab(tabId);
  }
});
// Apply settings to new tabs when they are created
chrome.tabs.onCreated.addListener(function (tab) {
  // Tab finished loading, apply the settings
  setTimeout(() => {
    applySettingsToTab(tab.id);
  }, 1000);
});

// Function to apply settings to a specific tab
function applySettingsToTab(tabId) {
  chrome.storage.local.get("settings", function (data) {
    if (chrome.runtime.lastError || !data.settings) {
      console.error("Failed to retrieve settings:", chrome.runtime.lastError);
      return;
    }
    const settings = data.settings;

    // Inject the content script into the tab and send the settings
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["content.js"],
      },
      function () {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed:", chrome.runtime.lastError);
          return;
        }
        // Send the settings to the content script
        chrome.tabs.sendMessage(tabId, {
          action: "applySettings",
          settings: settings,
        });
      }
    );
  });
}
