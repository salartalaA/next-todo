import "@/app/globals.css";
import TodoData from "@/app/components/todoData.component";

export default async function Page() {
  const data = await fetch("http://localhost:3004/api/todos");
  const todoData = await data.json();

  return <TodoData todoData={todoData} />;
}
