import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function DeleteTask({ params }) {
  const { taskId } = await params;

  // get clerk id
  const { userId } = await auth();
  if (userId == null) {
    redirect("/sign-in");
  }

  // get the task
  const taskData = await db.query(`SELECT * FROM tt_tasks WHERE id = $1`, [
    taskId,
  ]);
  const task = taskData.rows[0];

  if (!task) {
    return (
      <div className="p4 test-center">
        <h1 className="text-lg font-bold - text-white">Task Not Found</h1>
        <Link href="/" className="ttbutton-sm mt-4">
          Back to Tasks
        </Link>
      </div>
    );
  }

  async function handleDelete(formData) {
    "use server";
    await db.query("DELETE FROM tt_tasks WHERE id = $1", [
      formData.get("taskId"),
    ]);
    revalidatePath("/");
    redirect("/");
  }

  async function handleCancel() {
    "use server";
    redirect("/");
  }

  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-lg font-bold text-red-700 mb-4">Delete Task</h1>
        <div className="mb-4">
          <p>
            <strong>Title:</strong> {task.title}
          </p>
          <p>
            <strong>Details:</strong> {task.details}
          </p>
        </div>
        <p className="text-sm text-red-600 mb-4">
          Are you sure you want to delete this task?
        </p>
      </div>
      <div className="flex justify-center space-x-4">
        <form action={handleDelete}>
          <input type="hidden" name="taskId" value={taskId} />
          <button type="submit" className="ttbutton-sm">
            Confirm
          </button>
        </form>

        <Link href="/" className="ttbutton-sm">
          Cancel
        </Link>
      </div>
    </div>
  );
}
