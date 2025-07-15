import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow justify-center  items-center">
      <div className="flex flex-col items-center">
        <h1 className="pt-15">I don&apos;t know what that is!</h1>
        <Link href="/">
          <div className="m-10 p-2 border-4 bg-stone-700 border-stone-400 rounded-2xl w-40 text-center">
            Take Me Back
          </div>
        </Link>
      </div>
    </div>
  );
}
