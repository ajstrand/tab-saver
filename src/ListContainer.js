import React, {Component} from "react";
import ListItem from "./ListItem";

class ListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      allTabs:[]
    };
    this.getCurrentBrowserTabs = this.getCurrentBrowserTabs.bind(this);
    this.saveTabs = this.saveTabs.bind(this);
    this.getPinnedTabs = this.getPinnedTabs.bind(this);
  }
  componentDidMount () {
    let keyToGrab = "tabs";
    chrome.storage.sync.get(keyToGrab, (result) => {
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
          this.saveTabs();
        }
      }
      
    })
  }
  getPinnedTabs () {
    chrome.tabs.query({},  (tabs) => {
      let tabsArray = [];
      for (var i = 0; i < tabs.length; i++) {
        var localTab = tabs[i];
        var url = localTab.url;
        var isPinned = localTab.pinned ? true : false;
        var  hasStuff = this.state.allTabs.includes(url) ? true : false;
        if(!hasStuff && isPinned) {
          tabsArray.push(url)
        }
      }
      let noTabs = this.state.allTabs !== undefined || this.state.allTabs !== null ? true : false;
      if(noTabs){
        let arrayCopy = this.state.allTabs.slice();
        arrayCopy = arrayCopy.concat(tabsArray);
        this.setState({allTabs: arrayCopy});
      }
      else {
        this.setState({allTabs: tabsArray});
      }
      this.saveTabs();
    });
  }
  getCurrentBrowserTabs (){
    const extensionPage = 'chrome://newtab/';
    chrome.tabs.query({},  (tabs) => {
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
            tabsArray.push(url)
            chrome.tabs.remove(tabId);
          }
        }
      }
      let noTabs = this.state.allTabs !== undefined || this.state.allTabs !== null ? true : false;
      if(noTabs){
        let arrayCopy = this.state.allTabs.slice();
        arrayCopy = arrayCopy.concat(tabsArray);
        this.setState({allTabs: arrayCopy});
      }
      else {
        this.setState({allTabs: tabsArray});
      }
      this.saveTabs();
    });
  }
  saveTabs () {
    let tabsObj = {"tabs":this.state.allTabs};
    chrome.storage.sync.set(tabsObj, (result) => {
      console.log("tabs have been saved");
    })
  }
  renderList () {
    let data =  null;
    let noTabs = this.state.allTabs === 0 || 
    this.state.allTabs === null ||
    this.state.allTabs === undefined
     ? true : false;
    if(noTabs){
      this.saveTabs();
      let data = (<p>no tabs to show</p>);
      return data;
    }
    else {
      let greaterThanZero = this.state.allTabs.length > 0 ? true : false;
      if(greaterThanZero){
        data = this.state.allTabs.map(function(el, index){
          return (<ListItem url={el}></ListItem>)
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
        <button onClick={() => this.setState({allTabs:[]})}>delete all tabs</button>
        <button onClick={() => this.getPinnedTabs()}>get pinned tabs</button>
    {this.renderList()}
    </React.Fragment>
    );
  }
}

export default ListContainer;