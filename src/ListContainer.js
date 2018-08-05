import React, {Component} from "react";
import ListItem from "./ListItem";
const ExportTabs = require('./ExportTabs.bs').jsComponent;
class ListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      allTabs:[],
      tabsWithIds:[]
    };
    this.getCurrentBrowserTabs = this.getCurrentBrowserTabs.bind(this);
    this.saveTabs = this.saveTabs.bind(this);
    this.getPinnedTabs = this.getPinnedTabs.bind(this);
    this.deleteTabs = this.deleteTabs.bind(this);
    this.renderList = this.renderList.bind(this);
    this.createTabState = this.createTabState.bind(this);
  }
  componentDidMount () {
    chrome.storage.local.get("tabs", (result) => {
      let resultsUndefined = result === undefined ? true : false;
      if(resultsUndefined){
        console.error("result from storage is undefined");
      }
      else {
          let noTabs = result.tabs === null || result.tabs === undefined || result.tabs.length === 0 ? true : false;
          if(noTabs){
          this.getCurrentBrowserTabs();
        }
        else if(result.tabs.length > 0){
          //got tabs from memory
          this.setState({allTabs:result.tabs});
          this.getCurrentBrowserTabs();
        }
      }
      
    })
  }
  getPinnedTabs () {
    chrome.tabs.query({},  (tabs) => {
      let tabsWithIds = [];
      let tabsArray = [];
      for (var i = 0; i < tabs.length; i++) {
        var localTab = tabs[i];
        var url = localTab.url;
        let tabId = localTab.id;
        var isPinned = localTab.pinned ? true : false;
        var  hasStuff = this.state.allTabs.includes(url) ? true : false;
        if(!hasStuff && isPinned) {
          let obj = {
            url:url,
            tabId:tabId
          }
          tabsWithIds.push(obj)
          tabsArray.push(url)
        }
      }
      this.createTabState(tabsArray, tabsWithIds)
    });
  }
  getCurrentBrowserTabs (){
    const extensionPage = 'chrome://newtab/';
    chrome.tabs.query({},  (tabs) => {
      let tabsWithIds = [];
      let tabsArray = [];
      for (let i = 0; i < tabs.length; i++) {
        const localTab = tabs[i];
        let url = localTab.url;
        let tabId = localTab.id;
        let isPinned = localTab.pinned ? true : false;
        let listHasURL = this.state.allTabs.includes(url) ? true : false;
        if(!listHasURL && !isPinned) {
          let isNotExtensionPage = url !== extensionPage ? true : false;
          if(isNotExtensionPage){
            let obj = {
              url:url,
              tabId:tabId
            }
            tabsWithIds.push(obj)
            tabsArray.push(url)
            chrome.tabs.remove(tabId);
          }
        }
        this.createTabState(tabsArray, tabsWithIds)
      }
      
    });
  }
  createTabState (tabsArray, tabsWithIds) {
    let noTabs = this.state.allTabs === 0 ? true : false;
      if(!noTabs){
        let arrayCopy = this.state.allTabs.slice();
        tabsArray = arrayCopy.concat(tabsArray);     
      }
      this.setState({allTabs: tabsArray, tabsWithIds: tabsWithIds}, () => {
        let tabsGreaterThanZero = this.state.allTabs.length > 0 ? true : false;
        tabsGreaterThanZero ? this.saveTabs() : false;
      }); 
  }
  saveTabs () {
    chrome.storage.local.set({"tabs":this.state.allTabs}, () => {
      console.log("tabs have been saved");
    })
  }
  deleteTabs () {
    this.setState({allTabs:[], tabsWithIds:[]}, () => {
      chrome.storage.local.remove("tabs", () => {
        console.log("tabs have been deleted");
      })
    });
  }
  renderList () {
    let data =  null;
    let noTabs = this.state.tabsWithIds.length === 0 ? true : false;
    if(noTabs){
      data = (<p>no tabs to show</p>);
      return data;
    }
    else {
      let greaterThanZero = this.state.tabsWithIds.length > 0 ? true : false;
      if(greaterThanZero){
        data = this.state.tabsWithIds.map(function(urlObj, index){
          let url = urlObj.url;
          let id = urlObj.tabId;
          return (<ListItem id={id} url={url}></ListItem>)
        })
      }
      return (
        <ul className="tabList">
          {data}
      </ul>
      );
    }
  }
  render (){
    return (
      <React.Fragment>
        <div className="buttonGrp">
          <ExportTabs tabsData={this.state.allTabs}/>
          <button onClick={() => this.deleteTabs()}>delete all tabs</button>
          <button onClick={() => this.getPinnedTabs()}>get pinned tabs</button>
        </div>
    {this.renderList()}
    </React.Fragment>
    );
  }
}

export default ListContainer;