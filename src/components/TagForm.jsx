import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";

export default async function TagForm({ mode, userId, tagId }) {
  let tag = null;

  if (mode === "Edit") {
    const tagData = await db.query(
      `SELECT * FROM tt_tags WHERE id = $1 AND cid = $2`,
      [tagId, userId]
    );
    tag = tagData.rows[0];
  }

  async function handleSubmit(formData) {
    "use server";
    const data = {
      tag_name: formData.get("tag_name"),
      tag_details: formData.get("tag_details"),
    };

    if (mode === "Edit") {
      await db.query(
        `UPDATE tt_tags SET tag_name = $1, tag_details = $2 WHERE id = $3 AND cid = $4`,
        [data.tag_name, data.tag_details, tagId, userId]
      );
    } else {
      await db.query(
        `INSERT INTO tt_tags (tag_name, tag_details, cid) VALUES ($1, $2, $3)`,
        [data.tag_name, data.tag_details, userId]
      );
    }

    revalidatePath("/tags");
    redirect("/tags");
  }

  // view not yet needed
  if (mode === "View") {
    return <div>a tag place holder</div>;
  }

  // Check if tag exists for edit mode
  if (mode === "Edit" && !tag) {
    return (
      <div>
        <h1>Edit Refused</h1>
        <p>Tag not found or you don’t have permission to edit it.</p>
      </div>
    );
  }

  return (
    <div>
      <form
        action={handleSubmit}
        className="p-2 border-2 rounded-2xl flex flex-col"
      >
        <input
          type="text"
          name="tag_name"
          autoFocus
          maxLength="20"
          defaultValue={mode === "Edit" ? tag.tag_name : ""}
          placeholder="Enter the tag name here..."
          className="mt-1 w-full p-2 border sunken border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
          required
        />
        <textarea
          name="tag_details"
          maxLength="299"
          defaultValue={mode === "Edit" ? tag.tag_details : ""}
          placeholder="Enter tag details here ..."
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
