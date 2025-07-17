import { db } from "@/utils/dbConnection";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function TaskList() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // get tasks with taskRank (bitwise OR of tag ranks)
  // each tag.rank has a single bit set, by bitwise OR'ing them
  // we get a combined rank value for a given task, we can then
  // get the tasks ordered by this combined rank value
  const tasksQuery = await db.query(
    `SELECT t.*, COALESCE(BIT_OR(g.rank), 0) as task_rank
     FROM tt_tasks t
     LEFT JOIN tt_tag_links tl ON t.id = tl.task_id AND tl.cid = $1
     LEFT JOIN tt_tags g ON tl.tag_id = g.id AND g.cid = $1
     WHERE t.cid = $1
     GROUP BY t.id
     ORDER BY task_rank DESC, t.id ASC`,
    [userId]
  );

  const tasks = tasksQuery.rows;

  // get tags for display
  const taskTags = await db.query(
    `SELECT tl.task_id, tt_tags.id, tt_tags.tag_name
     FROM tt_tag_links tl
     JOIN tt_tags ON tl.tag_id = tt_tags.id
     WHERE tl.cid = $1`,
    [userId]
  );

  // helper function to map the tags for each task
  const taskTagsMap = taskTags.rows.reduce((map, { task_id, id, tag_name }) => {
    if (!map[task_id]) map[task_id] = [];
    map[task_id].push({ id, tag_name });
    return map;
  }, {});

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl sunken"
        >
          <details>
            <summary className="flex flex-col gap-1">
              <span>{task.title}</span>
              <div className="flex gap-2">
                {taskTagsMap[task.id]?.length > 0 ? (
                  taskTagsMap[task.id].map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 ttinerttag rounded-md"
                    >
                      {tag.tag_name}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-1 ttinerttag rounded-md">
                    No tags
                  </span>
                )}
              </div>
            </summary>
            <div className="flex flex-col gap-2 pt-3">
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
