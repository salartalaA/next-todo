"use client";

import "@/app/globals.css";
import Logo from "@/app/assets/Logo.png";
import plugIcon from "@/app/assets/Layer 2.png";
import cliIcon from "@/app/assets/Clipboard.png";
import { useState, useEffect, useContext } from "react";
import TodoItem from "@/app/components/todoItem.component";
import Image from "next/image";
import AuthContext from "../context/AuthContext";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function TodoData({ userID }) {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { user, logoutContext } = useContext(AuthContext);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `http://localhost:3004/api/todos/${userID.value}?page=${page}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos.");
      }
      const { todos: fetchedTodos, total, pages } = await response.json();
      setTodos(fetchedTodos);
      setTotalPages(pages);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching todos.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(
        todos.filter((todo) =>
          todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, todos]);

  const handleAddTodo = async () => {
    if (!todoText.trim()) {
      toast.error("Please enter a valid todo.");
      return;
    }

    const newTodo = { text: todoText.trim(), userID: userID.value };

    try {
      const response = await fetch(
        `http://localhost:3004/api/todos/${userID.value}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add the todo.");
      }

      fetchTodos();
      setTodoText("");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the todo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3004/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the todo.");
      }

      fetchTodos();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the todo.");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3004/api/todos/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to update the todo.");
      }

      fetchTodos();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the todo.");
    }
  };

  const doneTodos = todos.filter((todo) => todo.isCompleted);

  return (
    <div className="bg-primary min-h-screen pb-6">
      <div className="bg-secondary h-[200px] flex justify-center items-center">
        <Image src={Logo} alt="logo" />
        <div className="text-xs font-bold">
          {user ? (
            <>
              <span className="font-mono text-white ml-4 bg-indigo-600 p-1 rounded-lg shadow-md">
                {user.name}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  logoutContext();
                  router.push("/");
                }}
                className="mx-2 bg-pink-900 p-1 text-white rounded-lg shadow-md font-semibold"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <span>
                <Link href="/auth/login">login</Link>
              </span>
              <span className="mx-2">/</span>
              <span>
                <Link href="/auth/register">signup</Link>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex w-full justify-center items-center relative">
        <div className="flex gap-[8px] h-[54px] w-full px-6 md:px-0 md:w-[736px] absolute top-50%">
          <input
            className="border-none rounded-md w-full text-base outline-none bg-[#262626] p-4 text-[#fff]"
            placeholder="Add a new task"
            onChange={(e) => setTodoText(e.target.value)}
            value={todoText}
          />
          <button
            className="flex items-center p-4 rounded-md gap-2 text-[#fff] bg-[#1E6F9F]"
            onClick={handleAddTodo}
          >
            create
            <Image src={plugIcon} alt="plugIcon" />
          </button>
        </div>
      </div>

      <div className="mt-[91px] w-full flex justify-center">
        <div className="w-[736px] flex flex-col gap-6 mx-6">
          <div className="flex justify-between">
            <div className="text-[#4EA8DE] flex gap-2">
              Created Tasks
              <div className="py-[2px] px-[8px] rounded-full text-xs flex items-center bg-[#333333] text-[white]">
                {todos.length}
              </div>
            </div>
            <div className="text-[#4EA8DE] flex gap-2">
              Completed
              <div className="py-[2px] px-[8px] rounded-full text-xs flex items-center bg-[#333333] text-[white]">
                {doneTodos.length}
              </div>
            </div>
          </div>

          {todos.length ? (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search tasks..."
                className="border-none rounded-md w-full text-base outline-none bg-[#262626] p-4 text-[#fff]"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
          ) : (
            <></>
          )}

          {filteredTodos.length ? (
            filteredTodos.map((todo, index) => (
              <TodoItem
                key={index}
                text={todo.text}
                isCompleted={todo.isCompleted}
                id={todo.id}
                handleDelete={handleDelete}
                handleCompleteTask={handleCompleteTask}
              />
            ))
          ) : (
            <div className="flex gap-4 py-12 flex-col items-center border-t-[1px] border-[#333333] rounded-lg">
              <Image src={cliIcon} alt="cliIcon" className="size-14" />
              <div className="flex flex-col text-center text-[#808080]">
                <span className="font-bold">No tasks found!</span>
                <span>Try creating a task or adjust your search</span>
              </div>
            </div>
          )}

          {todos.length ? (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          ) : (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
