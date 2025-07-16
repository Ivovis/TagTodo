import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { db } from "@/utils/dbConnection";
import Link from "next/link";

export default async function TagList() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // go get tasks for this user
  const query = await db.query(`SELECT * FROM tt_tags WHERE cid = $1`, [
    userId,
  ]);

  return (
    <div>
      {query.rows.map((tag) => (
        <div
          key={tag.id}
          className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl infobar sunken"
        >
          <details>
            <summary>{tag.tag_name}</summary>
            <div>
              <br />
              <div>
                {tag.tag_details}
                <Link href={`/edittag/${tag.id}`} className="ttbutton-sm">
                  Edit
                </Link>
                <Link href={`/deletetag/${tag.id}`} className="ttbutton-sm">
                  Delete
                </Link>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
