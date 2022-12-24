import { useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";

function TaskList({ done = false }) {
  const { tasks, getTasks, loading, loadingUser } = useTasks();

  useEffect(() => {
    if (!loadingUser) getTasks(done);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, loadingUser]);

  function renderTasks() {
    if (loading) return <p>Loading...</p>;
    else if (!tasks.length) return <p>No tasks found</p>;
    else
      return (
        <div>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      );
  }

  return <div>{renderTasks()}</div>;
}

export default TaskList;
