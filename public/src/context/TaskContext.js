import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTasks must be used within a TaskContextProvider");
  return context;
};

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [adding, setadding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoadingUser(true);
    await supabase.auth.getUser().then((result) => {
      setUser(result.data.user);
      return result.data.user;
    });
    setLoadingUser(false);
  };

  const getTasks = async (done = false) => {
    setLoading(true);
    const { error, data } = await supabase
      .from("tasks")
      .select()
      .eq("userId", user.id)
      .eq("done", done)
      .order("id", { ascending: true });

    if (error) throw error;
    setTasks(data);
    setLoading(false);
  };

  const createTask = async (taskName) => {
    setadding(true);
    try {
      const { error, data } = await supabase
        .from("tasks")
        .insert({
          name: taskName,
          userId: user.id,
        })
        .select();
      if (error) throw error;

      setTasks([...tasks, ...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setadding(false);
    }
  };

  const deleteTask = async (id) => {
    const { error, data } = await supabase
      .from("tasks")
      .delete()
      .eq("userId", user.id)
      .eq("id", id)
      .select();

    if (error) throw error;

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = async (id, updateFields) => {
    console.log(id, updateFields);
    const { error, data } = await supabase
      .from("tasks")
      .update(updateFields)
      .eq("userId", user.id)
      .eq("id", id)
      .select();

    if (error) throw error;

    setTasks(tasks.filter((task) => task.id !== id));

  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        createTask,
        deleteTask,
        updateTask,
        adding,
        loading,
        loadingUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
