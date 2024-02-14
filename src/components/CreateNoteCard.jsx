import { useState } from 'react'
import PropTypes from "prop-types";

CreateNoteCard.propTypes = {
  AddNote: PropTypes.func.isRequired,
  columnId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

function CreateNoteCard({ AddNote, columnId, children }) {
  const [createNoteMode, setCreateNoteMode] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");

  return (
    <>
      {createNoteMode ? (
        <div className="w-full bg-white p-2 rounded-md shadow-sm">
          <input
            type="text"
            autoFocus
            className="w-full outline-teal-600 border-teal-600 bg-slate-50 text-xl font-semibold border-2 p-2 rounded-md"
            placeholder="Enter note title"
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddNote(columnId, noteTitle);
                setCreateNoteMode(false);
                setNoteTitle("");
              }
            }}
          />
          <div className="flex mt-2 gap-2">
            <button
              onClick={() => {
                AddNote(columnId, noteTitle);
                setCreateNoteMode(false);
                setNoteTitle("");
              }}
              className="rounded-md py-2 px-4 bg-teal-600 text-slate-50"
            >
              Aceptar
            </button>
            <button
              onClick={() => {
                setCreateNoteMode(false);
                setNoteTitle("");
              }}
              className="rounded-md py-2 px-4 bg-slate-50 border-2 border-teal-600 text-teal-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="w-full rounded-md p-2 hover:bg-teal-500 hover:text-teal-50 bg-teal-50 text-teal-500 transition-colors border-dashed border-teal-500 border-2 cursor-pointer flex justify-center items-center gap-2"
          onClick={() => setCreateNoteMode(true)}
        >
          {children}
        </button>
      )}
    </>
  )
}

export default CreateNoteCard