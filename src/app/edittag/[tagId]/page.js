import { redirect } from "next/navigation";
import TagForm from "@/components/TagForm";
import { auth } from "@clerk/nextjs/server";

export default async function EditTag({ params }) {
  const { tagId } = await params;
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <TagForm mode="Edit" userId={userId} tagId={tagId} />
    </div>
  );
}
