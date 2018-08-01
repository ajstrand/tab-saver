import React, {Fragment, Component} from "react";
import ListContainer from "./ListContainer";
const Reason = require('./Reason.bs').jsComponent
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      allTabs:[]
    };
    this.sendTabsForExport = this.sendTabsForExport.bind(this)
  }
  sendTabsForExport (tabs) {
    if(tabs.length > 0){
      this.setState({allTabs:tabs})
    }
  }
  render (){
    return (
      <Fragment>
      <Reason foobar={this.state.allTabs} message="hello from reason react"/>
      <ListContainer sendTabs={this.sendTabsForExport}></ListContainer>
      </Fragment>
    );
  }
}

export default App;