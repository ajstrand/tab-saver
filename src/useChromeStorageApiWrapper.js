import React, { useState, useEffect } from "react";
const useChromeStorageApiWrapper = (props) => {
  const [localTabs, setTabs] = useState(null);
  useEffect(() => {
    chrome.storage.local.get("tabs", result => {
      const resultsUndefined = result === undefined ? true : false;
      if (resultsUndefined) {
        console.error("result from storage is undefined");
      } else {
        const noTabs =
          result.tabs === null ||
          result.tabs === undefined ||
          result.tabs.length === 0
            ? true
            : false;
        if (result.tabs.length > 0) {
          //got tabs from memory
          setTabs(tabs);
        }
        const tabs = getCurrentBrowserTabs();
        const pinned = getPinnedTabs();
        const newList = tabs.concat(pinned);
        setTabs(newList);
      }
    });
  });
  const getPinnedTabs = () => {
    chrome.tabs.query({}, tabs => {
      const tabsWithIds = [];
      for (var i = 0; i < tabs.length; i++) {
        const localTab = tabs[i];
        const url = localTab.url;
        const tabId = localTab.id;
        const hasAudio = localTab.audible;
        const isPinned = localTab.pinned ? true : false;
        const listHasURL = tabs.find((localUrl, _i) => {
          return localUrl === url;
        });
        if (!listHasURL && isPinned && !hasAudio) {
          const obj = {
            url: url,
            tabId: tabId
          };
          tabsWithIds.push(obj);
        }
      }
      return tabsWithIds;
    });
  };
  const getCurrentBrowserTabs = () => {
    const extensionPage = "chrome://newtab/";
    chrome.tabs.query({}, tabs => {
      const tabsWithIds = [];
      for (let i = 0; i < tabs.length; i++) {
        const localTab = tabs[i];
        const url = localTab.url;
        const tabId = localTab.id;
        const hasAudio = localTab.audible;
        const isPinned = localTab.pinned ? true : false;
        const listHasURL = tabs.find((localUrl, _i) => {
          return localUrl === url;
        });
        const notInListOrPinnedOrAudio = !listHasURL && !isPinned && !hasAudio ? true : false;
        if (notInListOrPinnedOrAudio) {
          const isNotExtensionPage = url !== extensionPage ? true : false;
          if (isNotExtensionPage) {
            let obj = {
              url: url,
              tabId: tabId
            };
            tabsWithIds.push(obj);
            //chrome.tabs.remove(tabId);
          }
        }
        return tabsWithIds;
      }
    });
  };
  return localTabs;
};

export default useChromeStorageApiWrapper;
