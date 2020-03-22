import React from "react";
import Select from "react-select";
import useChromeStorageApiWrapper from "./useChromeStorageApiWrapper";
import styled from "styled-components";

const Cool = styled.div`
  width: 400px;
  height: 400px;
  background-color: "pink";
`;
const Popup = () => {
  const [options, setOptions] = useChromeStorageApiWrapper();
  const onChange = option => {
    setOptions(option);
  };
  return (
    <Cool>
      <Select value={selectedOption} onChange={onChange} options={options} />
    </Cool>
  );
};

export default Popup;