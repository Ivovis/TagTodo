import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import TaskForm from "@/components/TaskForm";

export default async function EditTask({ params }) {
  const { taskId } = await params;

  console.log("edit: taskId", taskId);

  const { userId } = await auth();
  if (userId == null) {
    redirect("/sign-in");
  }

  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <TaskForm mode="Edit" userId={userId} taskId={taskId} />
    </div>
  );
}
