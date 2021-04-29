import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "../shared/axios";
import { useStateValue } from "../StateProvider";

function CreateTaskForm({ tasks, taskID }) {
  const [storeValue, dispatch] = useStateValue();

  // form values..
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date().getTime());
  const [assignedUser, setAssignedUser] = useState(
    storeValue.user_details.name
  );
  const [formMode, setFormMode] = useState("INSERT");
  // const assignedUsersList = Array.from(new Set());

  useEffect(() => {
    if (storeValue.taskID_to_edit) {
      if (storeValue.user_tasks) {
        let task = storeValue.user_tasks.filter(
          (task) => task.id === storeValue.taskID_to_edit
        )[0];
        if (task) {
          setFormMode("EDIT");
          setTaskDescription(task.task_msg);
          setTaskDate(task.task_date);

          let taskTime = new Date(task.task_time * 1000)
            .toISOString()
            .substr(11, 8);
          let timeString =
            taskTime.split(":")[0] + ":" + taskTime.split(":")[2];
          setTaskTime(timeString);
          setAssignedUser(storeValue.user_details.name);
        }
      }
      console.log("storeValue.taskID_to_edit => ", storeValue.taskID_to_edit);
    }
  }, [storeValue.taskID_to_edit]);

  const convertTimeToSeconds = (taskTime) => {
    let inputTime = taskTime.split(":");
    var currentTime = new Date();
    currentTime.setHours(inputTime[0]);
    currentTime.setMinutes(inputTime[1]);
    var hms =
      currentTime.getHours() +
      " : " +
      currentTime.getMinutes() +
      " : " +
      currentTime.getSeconds();
    var a = hms.split(":");
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  };

  const resetForm = () => {
    setTaskDescription("");
    setTaskDate(new Date());
    setTaskTime(new Date().getTime());
    setAssignedUser("");
    dispatch({
      type: "SET_TASKID_TO_EDIT",
      payload: null,
    });
  };

  const upsertTask = async () => {
    let data = {
      assigned_user: assignedUser,
      task_date: format(new Date(taskDate), "yyyy-MM-dd"),
      task_time: convertTimeToSeconds(taskTime),
      is_completed: 0,
      time_zone: new Date(taskDate).getTimezoneOffset(),
      task_msg: taskDescription,
    };

    dispatch({
      type: "SET_LOADER_FLAG",
      payload: true,
    });

    if (formMode === "INSERT") {
      const createTaskAPI_headers = {
        Authorization: "Bearer " + storeValue.user_token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const createTaskAPI = await axios({
        method: "post",
        headers: createTaskAPI_headers,
        url: `task/lead_58be137bfde045e7a0c8d107783c4598`,
        data: data,
      });
      let response = createTaskAPI.data;

      if (
        response.code === 201 &&
        response.status.toLowerCase() === "success"
      ) {
        dispatch({
          type: "SET_SHOW_NOTIFICATION_FLAG",
          payload: true,
        });
        dispatch({
          type: "SET_NOTIFICATION_MESSAGE",
          payload: response.message,
        });
        dispatch({
          type: "SET_RELOAD_STATUS_FLAG",
          payload: true,
        });
        resetForm();
      }
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    } else if (formMode === "EDIT") {
      const updateTaskAPI_headers = {
        Authorization: "Bearer " + storeValue.user_token.token,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const updateTaskAPI = await axios({
        method: "PUT",
        headers: updateTaskAPI_headers,
        url: `task/lead_58be137bfde045e7a0c8d107783c4598/${storeValue.taskID_to_edit}`,
        data: data,
      });
      let response = updateTaskAPI.data;

      if (
        response.code === 202 &&
        response.status.toLowerCase() === "success"
      ) {
        dispatch({
          type: "SET_SHOW_NOTIFICATION_FLAG",
          payload: true,
        });
        dispatch({
          type: "SET_NOTIFICATION_MESSAGE",
          payload: response.message,
        });
        dispatch({
          type: "SET_RELOAD_STATUS_FLAG",
          payload: true,
        });
        resetForm();
      }
      dispatch({
        type: "SET_LOADER_FLAG",
        payload: false,
      });
    }
  };

  const deleteTask = async () => {
    dispatch({
      type: "SET_LOADER_FLAG",
      payload: true,
    });

    const deleteTaskAPI_headers = {
      Authorization: "Bearer " + storeValue.user_token.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const deleteTaskAPI = await axios({
      method: "DELETE",
      headers: deleteTaskAPI_headers,
      url: `task/lead_58be137bfde045e7a0c8d107783c4598/${storeValue.taskID_to_edit}`,
    });
    let response = deleteTaskAPI.data;
    if (response.status.toLowerCase() === "success" && response.code === 204) {
      dispatch({
        type: "SET_SHOW_NOTIFICATION_FLAG",
        payload: true,
      });
      dispatch({
        type: "SET_NOTIFICATION_MESSAGE",
        payload: response.message,
      });
      dispatch({
        type: "SET_RELOAD_STATUS_FLAG",
        payload: true,
      });
    }
    console.log("deleteTaskAPI =>", response);
    dispatch({
      type: "SET_LOADER_FLAG",
      payload: false,
    });
    // {"status": "success", "code": 204, "message": "Deleted successfully", "results": {}}
  };

  const handleDateChange = (date) => {
    setTaskDate(date);
  };

  return (
    <div className="create-task-form-container">
      <form>
        <ul className="flex-outer">
          <li>
            <label>Task Description</label>
          </li>
          <li>
            <input
              type="text"
              id="task-description"
              placeholder="Enter Task Description"
              onChange={(e) => setTaskDescription(e.target.value)}
              value={taskDescription}
            />
          </li>
          <li>
            <div style={{ marginTop: "5px" }}>
              <label>Date</label>
              <input
                type="date"
                id="task-date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
              />
            </div>
            <div>
              <label>Time</label>
              <input
                type="time"
                id="task-time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
              />
            </div>
          </li>
          <li>
            <select
              name="cars"
              id="assigned-to"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value={storeValue.user_details.name}>
                {storeValue.user_details.name}
              </option>
            </select>
          </li>
          <li>
            <div style={{ cursor: "pointer" }}>
              <i className="fas fa-trash-alt" onClick={(e) => deleteTask()}></i>
            </div>
            <button className="cancel-button" onClick={(e) => resetForm()}>
              Cancel
            </button>
            <button type="submit" onClick={(e) => upsertTask()}>
              {formMode === "EDIT" ? "Update" : "Save"}
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default CreateTaskForm;
