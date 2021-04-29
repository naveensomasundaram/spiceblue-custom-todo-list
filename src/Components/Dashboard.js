import React from "react";
import Accordian from "./Accordian";
import CreateTaskForm from "./CreateTaskForm";
import { useStateValue } from "../StateProvider";
import Task from "./Task";

function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [storeValue, dispatch] = useStateValue();
  const taskCount = storeValue.user_tasks.length;

  return (
    <div id="container">
      <div className="widget-container">
        <Accordian
          title={"TASKS(" + taskCount + ")"}
          tasks={storeValue.user_tasks}
          taskID={""}
          content={<CreateTaskForm />}
        />
        {storeValue.user_tasks &&
          storeValue.user_tasks.map((task, index) => (
            <Task key={index} task={task} />
          ))}
      </div>
      <div className="widget-container">Widget 2</div>
      {/* <div className="widget-container">Widget 3</div>
      <div className="widget-container">Widget 4</div> */}
    </div>
  );
}

export default Dashboard;
