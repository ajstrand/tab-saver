import React, {Component} from "react";
class ListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      url:props.url,
      id:props.id
    };
    this.deleteTab = this.deleteTab.bind(this);
  }
  deleteTab () {
    let stateCopy = this.state;
    let stringId = stateCopy.id.toString();
    chrome.storage.local.remove(stringId, () => {
      console.log("tab has been deleted");
      this.setState({url:null})
    })
  }
  renderTab () {
    if(this.state.url !== null){
      return (
        <React.Fragment>
        <div className="row">
        <button className="deleteTab" onClick={() => this.deleteTab()}>Delete tab</button>
        <a href={this.state.url}><li>{this.state.url}</li></a>
        </div>
          </React.Fragment>
      )
    }
    else {
      return (null)
    }
    
  }
  render (){
    return (
      this.renderTab()
    )
  }
}

export default ListItem;