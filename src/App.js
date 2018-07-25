import React, {Fragment, Component} from "react";
import ListContainer from "./ListContainer";
const Reason = require('./Reason.bs').jsComponent
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  render (){
    return (
      <Fragment>
      <Reason message="hello from reason react"/>
      <ListContainer></ListContainer>
      </Fragment>
    );
  }
}

export default App;