"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center  items-center p-15">
      <h1>Unexpected error</h1>
      <Link href="/">
        <div className="m-10 p-2 border-2 rounded-2xl w-40 text-center">
          Back
        </div>
      </Link>
    </div>
  );
}
