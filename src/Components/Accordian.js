import React, { useState, useRef } from "react";
// import Chevron from "./Chevron";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

  let toggleAccordion = () => {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon_rotate"
    );
  };

  return (
    <div className="accordion__section">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <p className="accordion__title">{props.title}</p>
        {setRotate === "accordion__icon" && (
          <AddIcon className={`accordion__icon`} width={10} fill={"#777"} />
        )}
        {setRotate === "accordion__icon_rotate" && (
          <RemoveIcon className={`accordion__icon`} width={10} fill={"#777"} />
        )}
      </button>
      <div ref={content} className="accordion__content">
        {setRotate === "accordion__icon_rotate" && (
          <div className="accordion__text"> {props.content}</div>
        )}
      </div>
    </div>
  );
}

export default Accordion;
