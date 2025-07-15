import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { db } from "@/utils/dbConnection";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";

export default async function TaskList() {
  const { userId } = await auth();
  if (userId == null) {
    redirect("/sign-in");
  }

  const query = await db.query(`SELECT * FROM tt_tasks WHERE cid = $1`, [
    userId,
  ]);

  console.log("row", query.rows);

  return (
    <div>
      {query.rows.map((task) => (
        <div
          key={task.id}
          className="flex p-3 m-2 gap-2 text-xs border-2 rounded-2xl bg-stone-100"
        >
          {`${task.title}: ${task.details}`}
        </div>
      ))}
    </div>
  );
}
