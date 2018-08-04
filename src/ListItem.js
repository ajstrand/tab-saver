import React, {Component} from "react";
class ListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      url:props.url
    };
  }
  render (){
    return (
      <a href={this.state.url}><li>{this.state.url}</li></a>
    )
  }
}

export default ListItem;