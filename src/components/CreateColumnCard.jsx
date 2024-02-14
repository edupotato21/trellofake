import { useState } from "react";
import PropTypes from "prop-types";

CreateColumnCard.propTypes = {
  AddColumn: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

function CreateColumnCard({ AddColumn, children }) {
  const [createColumnMode, setCreateColumnMode] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  return (
    <div>
      {createColumnMode ? (
        <div className="w-[350px] min-w-[350px] max-h-[500px] rounded-md bg-teal-100 p-4 shadow-sm">
          <input
            type="text"
            autoFocus
            className="w-full outline-teal-600 border-teal-600 bg-slate-50 text-xl font-semibold border-2 p-2 rounded-md"
            placeholder="Enter column title"
            value={columnTitle}
            onChange={(e) => {
              setColumnTitle(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddColumn(columnTitle);
                setCreateColumnMode(false);
                setColumnTitle("");
              }
            }}
          />
          <div className="flex mt-2 gap-2">
            <button
              onClick={() => {
                AddColumn(columnTitle);
                setCreateColumnMode(false);
                setColumnTitle("");
              }}
              className="rounded-md py-2 px-4 bg-teal-600 text-slate-50"
            >
              Aceptar
            </button>
            <button
              onClick={() => {
                setCreateColumnMode(false);
                setColumnTitle("");
              }}
              className="rounded-md py-2 px-4 bg-slate-50 border-2 border-teal-600 text-teal-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="w-[350px] mr-4 rounded-md p-2 hover:bg-teal-500 hover:text-teal-50 bg-teal-50 text-teal-500 transition-colors border-dashed border-teal-500 border-2 cursor-pointer flex justify-center items-center gap-2"
          onClick={() => setCreateColumnMode(true)}
        >
          {children}
        </button>
      )}
    </div>
  );
}

export default CreateColumnCard;
