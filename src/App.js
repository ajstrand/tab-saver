import React from "react";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name:props.message,
      count:0,
      allTabs:[]
    };
    this.updateCounter = this.updateCounter.bind(this);
    this.getCurrentBrowserTabs = this.getCurrentBrowserTabs.bind(this);
    this.saveTabs = this.saveTabs.bind(this);
  }
  componentDidMount () {
    let keyToGrab = "tabs";
    chrome.storage.sync.get(keyToGrab, (result) => {
      if(result === undefined){
        console.error("result from storage is undefined")
      }
      else {
        console.log("we have something")
          if(result.tabs === null || result.tabs === undefined){
          this.getCurrentBrowserTabs();
        }
        else if(result.tabs.length > 0){
          this.setState({allTabs:result.tabs});
          console.log("get tabs from memory");
          this.getCurrentBrowserTabs();
          this.saveTabs();
        }
      }
      
    })
  }
  getCurrentBrowserTabs (){
    chrome.tabs.query({},  (tabs) => {
      let tabsArray = [];
      for (var i = 0; i < tabs.length; i++) {
        var localTab = tabs[i];
        var url = localTab.url;
        var  hasStuff = this.state.allTabs.includes(url)
        if(hasStuff === false) {
          tabsArray.push(url)
        }
      }
      if(this.state.allTabs !== undefined || this.state.allTabs !== null){
        let arrayCopy = this.state.allTabs.slice();
        arrayCopy = arrayCopy.concat(tabsArray);
        this.setState({allTabs: arrayCopy});
        console.log(arrayCopy)
      }
      else {
        this.setState({allTabs: tabsArray});
        console.log(tabsArray)
      }
      console.log("get current browser tabs");
      this.saveTabs();
    });
  }
  saveTabs () {
    chrome.storage.sync.set({"tabs":this.state.allTabs}, (result) => {
      console.log("tabs have been saved");
    })
  }
  updateCounter () {
    this.setState({count:this.state.count+1});
  }
  renderList () {
    if(this.state.allTabs.length === 0 || this.state.allTabs === undefined){
      return (
        <p>no tabs to show</p>
      );
    }
    else {
      let data =  null;
      if(this.state.allTabs.length > 0){
        data = this.state.allTabs.map(function(el, index){
          return (<a href={el}><li>{el}</li></a>)
        })
      }
      else {
        data = <p>no tabs</p>;
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
      <p>Hello {this.state.name} from react!</p>
      <button id="counterButton" onClick={this.updateCounter}>Click me</button>
    <p className="numClicked">Button was clicked {this.state.count} times</p>
    {this.renderList()}
    </React.Fragment>
    );
  }
}

export default App;