/* ReasonReact used by ReactJS */
/* This is just a normal stateless component. The only change you need to turn
   it into a ReactJS-compatible component is the wrapReasonForJs call below */
   let component = ReasonReact.statelessComponent("Reason");

   let make = (~message, _children) => {
     ...component,
     render: _self => {
         <p> {ReasonReact.string(message)} </p>;
     },
   };
   
   /* The following exposes a `jsComponent` that the ReactJS side can use as
      require('greetingRe.js').jsComponent */
   [@bs.deriving abstract]
   type jsProps = {
     message: string
   };

   /* if **you know what you're doing** and have
   the correct babel/webpack setup, you can also do `let default = ...` and use it
   on the JS side as a default export. */
let jsComponent =
ReasonReact.wrapReasonForJs(~component, jsProps =>
  make(
    ~message=jsProps |. messageGet,[||]
  )
);