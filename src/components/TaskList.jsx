import { db } from "@/utils/dbConnection";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

export default async function TaskList() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch tasks for the user
  const tasksQuery = await db.query(`SELECT * FROM tt_tasks WHERE cid = $1`, [
    userId,
  ]);

  const tasks = tasksQuery.rows;

  // Fetch tags for each task
  const taskTags = await Promise.all(
    tasks.map(async (task) => {
      const tagsQuery = await db.query(
        `SELECT tt_tags.id, tt_tags.tag_name
         FROM tt_tag_links
         JOIN tt_tags ON tt_tag_links.tag_id = tt_tags.id
         WHERE tt_tag_links.task_id = $1 AND tt_tag_links.cid = $2`,
        [task.id, userId]
      );
      return { taskId: task.id, tags: tagsQuery.rows };
    })
  );

  // Create a map for easy tag lookup
  const taskTagsMap = taskTags.reduce((map, { taskId, tags }) => {
    map[taskId] = tags;
    return map;
  }, {});

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl infobar sunken"
        >
          <details>
            <summary className="flex flex-col gap-1">
              <span>{task.title}</span>
              <div className="flex gap-2">
                {taskTagsMap[task.id].length > 0 ? (
                  taskTagsMap[task.id].map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 ttinerttag {
 rounded-md"
                    >
                      {tag.tag_name}
                    </span>
                  ))
                ) : (
                  <span
                    className="px-2 py-1 ttinerttag {
 rounded-md"
                  >
                    No tags
                  </span>
                )}
              </div>
            </summary>
            <div className="flex flex-col gap-2 mt-5">
              <p>{task.details}</p>
              <div className="flex gap-2">
                <Link href={`/edit/${task.id}`} className="ttbutton-sm">
                  Edit
                </Link>
                <Link href={`/delete/${task.id}`} className="ttbutton-sm">
                  Delete
                </Link>
                <Link href={`/tag/${task.id}`} className="ttbutton-sm">
                  Tags
                </Link>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
