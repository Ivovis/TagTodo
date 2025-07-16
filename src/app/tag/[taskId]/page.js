export default async function TasksTags({ params }) {
  const { taskId } = await params;

  console.log("Showing tags for ", taskId);

  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <p className="flex justify-around">Task Tags Placeholder Page</p>
    </div>
  );
}
