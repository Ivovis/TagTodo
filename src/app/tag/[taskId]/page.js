import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";

export default async function TasksTags({ params }) {
  const { taskId } = await params;

  // get clerk id
  const { userId } = await auth();
  if (userId == null) {
    redirect("/sign-in");
  }

  // get all tags for this task using the taskId
  const taskData = await db.query(
    `SELECT * FROM tt_tasks WHERE id = $1 AND cid = $2`,
    [taskId, userId]
  );

  // check for errors
  if (!taskData.rows[0]) {
    return (
      <div className="flex-1 overflow-y-auto p-4 m-2 rounded-md box-border custom-shadow text-white">
        <p className="text-center">
          Task not found or you don’t have permission.
        </p>
      </div>
    );
  }

  const taskTagsData = await db.query(
    `SELECT tt_tags.id, tt_tags.tag_name
     FROM tt_tag_links
     JOIN tt_tags ON tt_tag_links.tag_id = tt_tags.id
     WHERE tt_tag_links.task_id = $1 AND tt_tag_links.cid = $2`,
    [taskId, userId]
  );

  const taskTags = taskTagsData.rows;

  // get all tags for this user
  const allTagsData = await db.query(`SELECT * FROM tt_tags WHERE cid = $1`, [
    userId,
  ]);

  const allTags = allTagsData.rows;

  // Toggle function to add and remove a given tag from the task
  async function handleToggleTag(formData) {
    "use server";
    const tagId = formData.get("tagId");
    const userId = formData.get("userId");
    const taskId = formData.get("taskId");

    // Check if tag is already linked
    const existingLink = await db.query(
      `SELECT * FROM tt_tag_links WHERE task_id = $1 AND tag_id = $2 AND cid = $3`,
      [taskId, tagId, userId]
    );

    // toggle if > 0 rows
    if (existingLink.rows.length > 0) {
      // Remove tag link
      await db.query(
        `DELETE FROM tt_tag_links WHERE task_id = $1 AND tag_id = $2 AND cid = $3`,
        [taskId, tagId, userId]
      );
    } else {
      // Add tag link
      await db.query(
        `INSERT INTO tt_tag_links (task_id, tag_id, cid) VALUES ($1, $2, $3)`,
        [taskId, tagId, userId]
      );
    }

    revalidatePath(`/tag/${taskId}`);
  }

  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      {/* display existing tags on this task */}
      <div className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl infobar sunken">
        {taskTags.length > 0 ? (
          taskTags.map((tag) => (
            <span key={tag.id} className="px-2 py-1 ttinerttag rounded-md">
              {tag.tag_name}
            </span>
          ))
        ) : (
          <span>No tags assigned</span>
        )}
      </div>

      {/* display all available tags */}
      <div className="flex flex-col p-3 m-2 gap-2 text-xs border-2 rounded-2xl infobar sunken">
        <div className="max-w-md mx-auto grid grid-cols-3 sm:grid-cols-3 gap-2">
          {allTags.length > 0 ? (
            allTags.map((tag) => (
              <form key={tag.id} action={handleToggleTag}>
                <input type="hidden" name="tagId" value={tag.id} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="taskId" value={taskId} />
                <button
                  type="submit"
                  className={`ttbutton-sm ${
                    taskTags.some((t) => t.id === tag.id) ? "bg-green-600" : ""
                  }`}
                >
                  {tag.tag_name}
                </button>
              </form>
            ))
          ) : (
            <span>No tags available</span>
          )}
        </div>
      </div>
    </div>
  );
}
