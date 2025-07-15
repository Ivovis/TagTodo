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
  }

  // revalidate

  // redirect
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
        <h1 className="text-center p-3">Time to create your profile</h1>
        <input
          type="text"
          name="title"
          maxLength="30"
          placeholder="Enter the task name here..."
          className="p-3 m-2 border-2 rounded-md h-10"
          required
        />

        <textarea
          type="text"
          name="details"
          maxLength="299"
          placeholder="Enter task details here ..."
          required
          className="p-3 m-2 border-2 rounded-md h-30"
        />
        <div className="flex justify-center ">
          <button
            type="submit"
            className="p-2 mt-3 m-2 w-50 bg-fuchsia-100 border-2 rounded-md "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
