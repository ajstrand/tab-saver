/* ReasonReact used by ReactJS */
/* The only change you need to turn
   it into a ReactJS-compatible component is the wrapReasonForJs call below */

   /* State declaration */
type state = {
  instructions:string
}

/* Action declaration */
type action =
  | ExportTabs;

let str = ReasonReact.string;

   let component = ReasonReact.reducerComponent("ExportTabs");

   let make = (~tabsData, _children) => {
    
     ...component,
     initialState: () => {instructions:"Click here to download your tabs"},
     
  /* State transitions */
  reducer: (action, state) =>
    switch (action) {
    | ExportTabs => {
      let downloadTabs: array(string) => int = [%bs.raw {|
      function (tabsArr) {
        let jsonData = JSON.stringify(tabsArr)
        let element = document.createElement("a");
        let jsonArr = [jsonData];
        let obj = {type: 'application/json'};
        let file = new Blob(jsonArr, obj);
        let filename = "mySavedTabs.json"
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
      }
      |}];

      downloadTabs(tabsData) |> ignore;
      
      ReasonReact.NoUpdate;
    }
    },

     render: _self => {
      <button onClick={_e => _self.send(ExportTabs)}> {str(_self.state.instructions)} </button>
     },
   };
   
   /* The following exposes a `jsComponent` that the ReactJS side can use as
      require('greetingRe.js').jsComponent */
   [@bs.deriving abstract]
   type jsProps = {
     tabsData:array(string)
   };

   /* if **you know what you're doing** and have
   the correct babel/webpack setup, you can also do `let default = ...` and use it
   on the JS side as a default export. */
let jsComponent =
ReasonReact.wrapReasonForJs(~component, jsProps =>
  make(
    ~tabsData=jsProps |. tabsDataGet,[||]
  )
);