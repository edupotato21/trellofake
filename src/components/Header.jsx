import { MdTableChart } from "react-icons/md";

function Header() {
  return (
    <header className="bg-teal-900 h-16">
      <div className="container h-full mx-auto">
        <div className="flex justify-center items-center h-full">
          <div className="flex gap-2 text-slate-50">
            <MdTableChart size={32} />
            <span className="font-semibold text-lg">React Kanban</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
