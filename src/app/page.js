import "@/app/globals.css";
import TodoData from "@/app/components/todoData.component";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID");
  return <TodoData userID={userID} />;
}
