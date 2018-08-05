import "./newtab.scss"

import React, {Fragment, Component} from "react";
import ListContainer from "./ListContainer";
class App extends Component {
  constructor(props){
    super(props);
  }
  render (){
    return (
      <Fragment>
      <ListContainer></ListContainer>
      </Fragment>
    );
  }
}

export default App;