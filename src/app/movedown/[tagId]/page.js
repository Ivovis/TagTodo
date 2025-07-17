import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";

export default async function MoveTagRankDown({ params }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { tagId } = await params;

  await db.query("BEGIN");

  try {
    // get current tag's rank
    const currentTag = await db.query(
      `SELECT rank FROM tt_tags WHERE id = $1 AND cid = $2`,
      [tagId, userId]
    );

    const currentRank = currentTag.rows[0]?.rank;

    if (currentRank > 0) {
      // swap with next lower power of 2
      const lowerTag = await db.query(
        `SELECT id, rank FROM tt_tags WHERE cid = $1 AND rank < $2 AND rank >= 0 ORDER BY rank DESC LIMIT 1`,
        [userId, currentRank]
      );

      if (lowerTag.rows.length > 0) {
        const { id: targetId, rank: targetRank } = lowerTag.rows[0];
        await db.query(
          `UPDATE tt_tags SET rank = $1 WHERE id = $2 AND cid = $3`,
          [targetRank, tagId, userId]
        );
        await db.query(
          `UPDATE tt_tags SET rank = $1 WHERE id = $2 AND cid = $3`,
          [currentRank, targetId, userId]
        );
      }
    }

    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");

    console.error("Error during tag move down:", error);
    throw error;
  }

  redirect("/tags");
}
