import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function TaskForm({ mode, userId, taskId }) {
  let task = null;

  if (mode === "Edit") {
    const taskData = await db.query(
      `SELECT * FROM tt_tasks Where id = $1 And cid = $2`,
      [taskId, userId]
    );
    task = taskData.rows[0];
  }

  async function handleSubmit(formData) {
    "use server";

    const data = {
      title: formData.get("title"),
      details: formData.get("details"),
    };

    if (mode === "Edit") {
      await db.query(
        `UPDATE tt_tasks SET title = $1, details = $2 WHERE id = $3 AND cid = $4`,
        [data.title, data.details, taskId, userId]
      );
    } else {
      await db.query(
        `INSERT INTO tt_tasks (title, details, cid) VALUES ($1, $2, $3)`,
        [data.title, data.details, userId]
      );
    }

    revalidatePath(`/`);
    redirect(`/`);
  }

  // just display the task - not yet needed
  if (mode === "View")
    return (
      <>
        <h1>View</h1>
      </>
    );

  // check we have a task if editing
  if (mode === "Edit" && !task)
    return (
      <>
        <h1>Edit Refused</h1>
        <p>Task not found or you don’t have permission to edit it.</p>
      </>
    );

  return (
    <div>
      <form
        action={handleSubmit}
        className="p-2 border-2 rounded-2xl flex flex-col"
      >
        <input
          type="text"
          name="title"
          autoFocus
          maxLength="60"
          defaultValue={mode === "Edit" ? task.title : ""}
          placeholder="Enter the task name here..."
          className="mt-1 w-full p-2 border sunken border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
          required
        />
        <textarea
          name="details"
          maxLength="299"
          defaultValue={mode === "Edit" ? task.details : ""}
          placeholder="Enter task details here ..."
          className="h-60 mt-5 w-full p-2 border sunken border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
          required
        />
        <div className="flex justify-center pt-5">
          <button type="submit" className="ttbutton">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
