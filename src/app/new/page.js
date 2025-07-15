import TaskForm from "@/components/TaskForm";
import { auth } from "@clerk/nextjs/server";

export default async function NewTask() {
  const { userId } = await auth();
  if (userId == null) {
    redirect("/sign-in");
  }

  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <TaskForm mode="New" userId={userId} />
    </div>
  );
}
