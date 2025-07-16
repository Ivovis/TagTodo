export default function About() {
  return (
    <div className="flex-1 overflow-y-auto custom-panel  text-white p-4 m-2 rounded-md box-border custom-shadow">
      <p className="flex justify-around">About Page</p>
      <a
        target="_blank"
        href="https://icons8.com/icon/19209/light"
        className="text-sm flex justify-around"
      >
        Application icon Lightbulb
      </a>
      <a
        target="_blank"
        href="https://icons8.com"
        className="text-sm flex justify-around"
      >
        Icons8
      </a>
    </div>
  );
}
