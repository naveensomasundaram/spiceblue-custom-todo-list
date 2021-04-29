import React from "react";
import { format } from "date-fns";
import { useStateValue } from "../StateProvider";

function Task({ task }) {
  const [storeValue, dispatch] = useStateValue();

  const updateTaskIDToEdit = () => {
    dispatch({
      type: "SET_TASKID_TO_EDIT",
      payload: task.id,
    });
    dispatch({
      type: "SET_ACCORDIAN_UPDATE_STATUS",
      payload: true,
    });
  };

  return (
    <div
      className="task-container"
      style={{
        backgroundColor: "lightgray",
        padding: "10px",
        minHeight: "50px",
      }}
    >
      <div style={{ width: "30%" }}>
        <img
          src="avatar.png"
          alt="Avatar"
          className="avatar"
          style={{ float: "left" }}
        />
      </div>
      <div style={{ width: "70%" }}>
        {task.task_msg}
        <p>{format(new Date(task.task_date), "MM/dd/yyyy")}</p>
      </div>
      <div
        className="icon-container"
        style={{ float: "right", width: "20%", cursor: "pointer" }}
        onClick={(e) => updateTaskIDToEdit()}
      >
        <i className="far fa-edit"></i>
      </div>
    </div>
  );
}

export default Task;
