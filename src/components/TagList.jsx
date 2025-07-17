import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";
import Link from "next/link";

export default async function TagList() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // get sorted tags
  const tagsData = await db.query(
    `SELECT * FROM tt_tags WHERE cid = $1 ORDER BY rank DESC, id ASC`,
    [userId]
  );
  const tags = tagsData.rows;

  return (
    <div>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl infobar sunken"
        >
          <details>
            <summary>{tag.tag_name}</summary>
            <div className="flex flex-col gap-2 pt-3">
              <p>{tag.tag_details}</p>
              <div className="flex gap-2">
                <Link href={`/edittag/${tag.id}`} className="ttbutton-sm">
                  Edit
                </Link>
                <Link href={`/deletetag/${tag.id}`} className="ttbutton-sm">
                  Delete
                </Link>
                <Link
                  href={`/moveup/${tag.id}`}
                  className={`ttbutton-sm ${
                    tag.rank > 0 &&
                    tags.every((t) => t.rank <= tag.rank || t.cid !== userId)
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  Up
                </Link>
                <Link
                  href={`/movedown/${tag.id}`}
                  className={`ttbutton-sm ${
                    tag.rank === 0 ||
                    !tags.some(
                      (t) =>
                        t.rank < tag.rank && t.rank >= 0 && t.cid === userId
                    )
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  Down
                </Link>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
