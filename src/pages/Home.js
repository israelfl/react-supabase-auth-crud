import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { getUserData } from "../services";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Home() {
  const [showTaskDone, setshowTaskDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData()
      .then((result) => {
        if (!result) navigate("/login");
      })
      .catch((error) => console.error(error));
  }, [navigate]);

  return (
    <div className="row mt-4">
      <div className="col-md-4 offset-md-4">
        <TaskForm />
        <header className="d-flex justify-content-between my-3">
          <span className="h5">
            {showTaskDone ? "Done tasks" : "Pending tasks"}
          </span>
          <button
            className="btn btn-dark btn-sm"
            onClick={() => setshowTaskDone(!showTaskDone)}
          >
            {showTaskDone ? "Show Pending Tasks" : "Show Done Tasks"}
          </button>
        </header>
        <TaskList done={showTaskDone} />
      </div>
    </div>
  );
}

export default Home;
