/* ReasonReact used by ReactJS */
/* The only change you need to turn
   it into a ReactJS-compatible component is the wrapReasonForJs call below */

   /* State declaration */
type state = {
  tabs:array(string)
}

/* Action declaration */
type action =
  | ExportTabs;

let str = ReasonReact.string;

   let component = ReasonReact.reducerComponent("Reason");

   let make = (~message, ~foobar, _children) => {
    
     ...component,
     initialState: () => {tabs:foobar},
     
  /* State transitions */
  reducer: (action, state) =>
    switch (action) {
    | ExportTabs => {
      Js.log("im an export function");
      Js.log(foobar);
      ReasonReact.NoUpdate;
    }
    },

     render: _self => {
       <div className="reasonList">
       (ReasonReact.array(
        Array.map(
          (url) =>
            <p>{str(url)}</p>,
            foobar
         ) 
      ))
      <button onClick={_e => _self.send(ExportTabs)}> {str(message)} </button>
      </div>   
     },
   };
   
   /* The following exposes a `jsComponent` that the ReactJS side can use as
      require('greetingRe.js').jsComponent */
   [@bs.deriving abstract]
   type jsProps = {
     message: string,
     foobar:array(string)
   };

   /* if **you know what you're doing** and have
   the correct babel/webpack setup, you can also do `let default = ...` and use it
   on the JS side as a default export. */
let jsComponent =
ReasonReact.wrapReasonForJs(~component, jsProps =>
  make(
    ~message=jsProps |. messageGet,
    ~foobar=jsProps |. foobarGet,[||]
  )
);