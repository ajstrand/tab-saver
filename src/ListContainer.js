import React, { useState } from "react";
import ListItem from "./ListItem";
import useChromeStorageApiWrapper from "./useChromeStorageApiWrapper";
const ListContainer = () => {
  const [tabs, setTabs] = useChromeStorageApiWrapper();

  useEffect(() => {
    createTabState();
  });
  
  const createTabState = () => {
    let noTabs = tabs === 0 ? true : false;
    if (!noTabs) {
      const arrayCopy = tabs.slice();
      tabsWithIds = arrayCopy.concat(tabsWithIds);
    }
    const tabsGreaterThanZero = tabs.length > 0 ? true : false;
    tabsGreaterThanZero ? saveTabs() : false;
  };

  const saveTabs = () => {
    chrome.storage.local.set({ tabs: tabs }, () => {
      console.log("tabs have been saved");
    });
  };
  const deleteTabs = () => {
    setTabs(tabs, () => {
      chrome.storage.local.remove("tabs", () => {
        console.log("tabs have been deleted");
      });
    });
  };
  const findAndDeleteTab = stringId => {
    if (tabs !== null) {
      const numToRemove = 1;
      const copy = tabs.slice();
      const indexToRemove = copy.findIndex((urlObj, _index) => {
        const id = urlObj.tabId;
        const passCondition = id === parseInt(stringId);
        return passCondition;
      });
      copy.splice(indexToRemove, numToRemove);
      setTabs(copy, () => {
        saveTabs();
      });
    }
  };
  const renderList = () => {
    let data = null;
    let noTabs = tabs.length === 0 ? true : false;
    if (noTabs) {
      data = <p>no tabs to show</p>;
      return data;
    } else {
      let greaterThanZero = tabs.length > 0 ? true : false;
      if (greaterThanZero) {
        data = tabs.map((urlObj, _index) => {
          const { url, tabId } = urlObj;
          return (
            <ListItem
              callback={findAndDeleteTab}
              key={id}
              id={tabId}
              url={url}
            ></ListItem>
          );
        });
      }
      return <ul className="tabList">{data}</ul>;
    }
  };
  return (
    <main>
      <section className="buttonGrp">
        <button onClick={() => deleteTabs()}>delete all tabs</button>
        <button onClick={() => getPinnedTabs()}>get pinned tabs</button>
      </section>
      {renderList()}
    </main>
  );
};

export default ListContainer;
