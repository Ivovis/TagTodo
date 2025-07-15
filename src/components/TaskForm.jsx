import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function TaskForm(props) {
  // modes: View Edit New
  const mode = props.mode;
  const taskID = props.taskId;
  const userId = props.userId;

  async function handleSubmit(formData) {
    "use server";

    formData = {
      title: formData.get("title"),
      details: formData.get("details"),
    };

    db.query(`INSERT INTO tt_tasks (title,details,cid) VALUES ($1,$2,$3)`, [
      formData.title,
      formData.details,
      userId,
    ]);

    revalidatePath(`/`);
    redirect(`/`);
  }

  // just display the task
  if (mode === "View")
    return (
      <>
        <h1>View</h1>
      </>
    );

  // populated form
  if (mode === "Edit")
    return (
      <>
        <h1>Edit</h1>
      </>
    );

  // empty form
  if (mode === "New")
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
            placeholder="Enter the task name here..."
            className="mt-1 w-full p-2 border sunken border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <textarea
            type="text"
            name="details"
            maxLength="299"
            placeholder="Enter task details here ..."
            required
            className="h-60 mt-5 w-full p-2 border sunken border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
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
