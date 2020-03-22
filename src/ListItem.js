import React, { useState } from "react";
const ListItem = props => {
  const [url, setUrl] = useState(props.url);
  const [id, setId] = useState(props.id);

  const deleteTab = () => {
    const idCopy = id.toString();
    props.callback(idCopy);
  };
  const renderTab = () => {
    if (url) {
      return (
        <React.Fragment>
          <div className="row">
            <button className="deleteTab" onClick={() => deleteTab()}>
              Delete tab
            </button>
            <a href={url}>
              <li>{url}</li>
            </a>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };
  return renderTab();
};

export default ListItem;
