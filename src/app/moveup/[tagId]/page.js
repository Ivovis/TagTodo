import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/utils/dbConnection";

export default async function MoveTagRankUp({ params }) {
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

    if (currentRank === 0) {
      // get used ranks to determine highest available power of 2
      const usedRanks = await db.query(
        `SELECT rank FROM tt_tags WHERE cid = $1 AND rank > 0 ORDER BY rank ASC`,
        [userId]
      );

      const ranks = usedRanks.rows.map((row) => row.rank);

      let newRank = 0;
      // check powers of 2 from 2^30 down to 2^0
      for (let i = 30; i >= 0; i--) {
        const power = 1 << i; // 2^i
        if (!ranks.includes(power)) {
          newRank = power;
          break;
        }
      }

      if (newRank === 0) {
        // all ranks used, swap with lowest non-zero rank (2^0 = 1)
        const lowestNonZero = await db.query(
          `SELECT id, rank FROM tt_tags WHERE cid = $1 AND rank > 0 ORDER BY rank ASC LIMIT 1`,
          [userId]
        );

        if (lowestNonZero.rows.length > 0) {
          const { id: targetId, rank: targetRank } = lowestNonZero.rows[0];
          await db.query(
            `UPDATE tt_tags SET rank = 0 WHERE id = $1 AND cid = $2`,
            [targetId, userId]
          );
          await db.query(
            `UPDATE tt_tags SET rank = $1 WHERE id = $2 AND cid = $3`,
            [targetRank, tagId, userId]
          );
        }
      } else {
        // assign highest available power of 2
        await db.query(
          `UPDATE tt_tags SET rank = $1 WHERE id = $2 AND cid = $3`,
          [newRank, tagId, userId]
        );
      }
    } else {
      // swap with next higher power of 2
      const higherTag = await db.query(
        `SELECT id, rank FROM tt_tags WHERE cid = $1 AND rank > $2 AND rank <= 1073741824 ORDER BY rank ASC LIMIT 1`,
        [userId, currentRank]
      );

      if (higherTag.rows.length > 0) {
        const { id: targetId, rank: targetRank } = higherTag.rows[0];
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

    console.error("Error during move up:", error);

    throw error;
  }

  redirect("/tags");
}
