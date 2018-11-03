import React, {Component} from "react";
import ListItem from "./ListItem";
const ExportTabs = require('./ExportTabs.bs').jsComponent;
class ListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabsWithIds:[]
    };
    this.searchTabs = this.searchTabs.bind(this)
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
          this.setState({tabsWithIds:result.tabs});
          this.getCurrentBrowserTabs();
        }
      }
      
    })
  }
  getPinnedTabs () {
    chrome.tabs.query({},  (tabs) => {
      let tabsWithIds = [];
      for (var i = 0; i < tabs.length; i++) {
        var localTab = tabs[i];
        var url = localTab.url;
        let tabId = localTab.id;
        var isPinned = localTab.pinned ? true : false;
        let listHasURL = this.state.tabsWithIds.find((localUrl, i) => {
          return localUrl === url;
        })        
        if(!listHasURL && isPinned) {
          let obj = {
            url:url,
            tabId:tabId
          }
          tabsWithIds.push(obj)
        }
      }
      this.createTabState(tabsWithIds)
    });
  }
  getCurrentBrowserTabs (){
    const extensionPage = 'chrome://newtab/';
    chrome.tabs.query({},  (tabs) => {
      let tabsWithIds = [];
      for (let i = 0; i < tabs.length; i++) {
        const localTab = tabs[i];
        let url = localTab.url;
        let tabId = localTab.id;
        let isPinned = localTab.pinned ? true : false;
        let listHasURL = this.state.tabsWithIds.find((localUrl, i) => {
          return localUrl === url;
        })
        if(!listHasURL && !isPinned) {
          let isNotExtensionPage = url !== extensionPage ? true : false;
          if(isNotExtensionPage){
            let obj = {
              url:url,
              tabId:tabId
            }
            tabsWithIds.push(obj)
            chrome.tabs.remove(tabId);
          }
        }
        this.createTabState(tabsWithIds)
      }
      
    });
  }
  createTabState (tabsWithIds) {
    let noTabs = this.state.tabsWithIds === 0 ? true : false;
      if(!noTabs){
        let arrayCopy = this.state.tabsWithIds.slice();
        tabsWithIds = arrayCopy.concat(tabsWithIds);     
      }
      this.setState({tabsWithIds: tabsWithIds}, () => {
        let tabsGreaterThanZero = this.state.tabsWithIds.length > 0 ? true : false;
        tabsGreaterThanZero ? this.saveTabs() : false;
      }); 
  }
  saveTabs () {
    chrome.storage.local.set({"tabs":this.state.tabsWithIds}, () => {
      console.log("tabs have been saved");
    })
  }
  deleteTabs () {
    this.setState({tabsWithIds:[]}, () => {
      chrome.storage.local.remove("tabs", () => {
        console.log("tabs have been deleted");
      })
    });
  }
  searchTabs (stringId) {
    if(this.state.tabsWithIds !== null){
      let numToRemove = 1;
      let copy = this.state.tabsWithIds.slice();
      let indexToRemove = copy.findIndex((urlObj, index) => {
        let id = urlObj.tabId;
        let passCondition = id === parseInt(stringId);
        return passCondition;
      })
      copy.splice(indexToRemove, numToRemove);
      this.setState({tabsWithIds:copy}, () => {
        this.saveTabs();
      });
      
    }
    
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
        data = this.state.tabsWithIds.map((urlObj, index) => {
          let url = urlObj.url;
          let id = urlObj.tabId;
          return (<ListItem 
            callback={this.searchTabs} 
            key={id} 
            id={id} 
            url={url}>
            </ListItem>)
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