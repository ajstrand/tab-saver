import "./newtab.scss"

import React, {Component} from "react";
import ListContainer from "./ListContainer";
class App extends Component {
  constructor(props){
    super(props);
  }
  render (){
    return (
      <ListContainer></ListContainer>
    );
  }
}

export default App;