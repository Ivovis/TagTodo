import { db } from "@/utils/dbConnection";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export default async function DeleteTag({ params }) {
  const { tagId } = await params;

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const tagData = await db.query(
    `SELECT * FROM tt_tags WHERE id = $1 AND cid = $2`,
    [tagId, userId]
  );

  const tag = tagData.rows[0];

  if (!tag) {
    return (
      <div className="p-4 text-center text-white">
        <h1 className="text-lg font-bold">Tag Not Found</h1>
        <Link href="/tags" className="ttbutton-sm mt-4">
          Back to Tags
        </Link>
      </div>
    );
  }

  // Get any links for this tag
  const tagLinksData = await db.query(
    `SELECT * FROM tt_tag_links WHERE tag_id = $1 AND cid = $2`,
    [tagId, userId]
  );

  // if we have any returned rows show the error page
  if (tagLinksData.rows.length > 0) {
    return (
      <div className="flex-1 overflow-y-auto custom-panel text-white p-4 m-2 rounded-md box-border custom-shadow">
        <h1 className="flex justify-center text-lg font-bold text-red-700 mb-4">
          Cannot Delete Tag
        </h1>
        <div className="flex flex-col items-center mb-4 text-left">
          <p>
            <strong>Name:</strong> {tag.tag_name}
          </p>
          <p>
            <strong>Details:</strong> {tag.tag_details}
          </p>
        </div>
        <p className="flex justify-center text-sm text-red-600 mb-4">
          This tag is currently in use by one or more tasks and cannot be
          deleted.
        </p>
        <div className="flex justify-center">
          <Link href="/tags" className="ttbutton-sm">
            Back to Tags
          </Link>
        </div>
      </div>
    );
  }

  async function handleDelete(formData) {
    "use server";
    const id = formData.get("tagId");
    console.log("deleting tagId:", id);
    await db.query("DELETE FROM tt_tags WHERE id = $1 AND cid = $2", [
      id,
      userId,
    ]);
    revalidatePath("/tags");
    redirect("/tags");
  }

  // show the normal warning and as for confirmation
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <h1 className="flex justify-center text-lg font-bold text-red-700 mb-4">
        Delete Tag
      </h1>
      <div className="flex flex-col items-center mb-4 text-left">
        <p>
          <strong>Name:</strong> {tag.tag_name}
        </p>
        <p>
          <strong>Details:</strong> {tag.tag_details}
        </p>
      </div>
      <p className="flex justify-center text-sm text-red-600 mb-4">
        Are you sure you want to delete this tag?
      </p>
      <div className="flex justify-center space-x-4">
        <form action={handleDelete}>
          <input type="hidden" name="tagId" value={tagId} />
          <button type="submit" className="ttbutton-sm">
            Confirm
          </button>
        </form>
        <Link href="/tags" className="ttbutton-sm">
          Cancel
        </Link>
      </div>
    </div>
  );
}
