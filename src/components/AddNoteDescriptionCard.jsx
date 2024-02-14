import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";

AddNoteDescriptionCard.propTypes = {
  AddNoteDescription: PropTypes.func.isRequired,
  noteId: PropTypes.string.isRequired,
};

function AddNoteDescriptionCard({ AddNoteDescription, noteId }) {
  const [createNoteDescriptionMode, setCreateNoteDescriptionMode] =
    useState(false);
  const [noteDescription, setNoteDescription] = useState("");

  return (
    <>
      {createNoteDescriptionMode ? (
        <div className="w-full">
          <textarea
            autoFocus
            className="w-full outline-teal-600 border-teal-600 bg-slate-50 text-base font-normal border-2 p-2 rounded-md"
            placeholder="Enter note description"
            value={noteDescription}
            onChange={(e) => {
              setNoteDescription(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddNoteDescription(noteDescription, noteId);
                setCreateNoteDescriptionMode(false);
                setNoteDescription("");
              }
            }}
          />
          <div className="flex mt-2 gap-2">
            <button
              onClick={() => {
                setCreateNoteDescriptionMode(false);
                setNoteDescription("");
              }}
              className="rounded-md py-2 px-4 bg-slate-50 border-2 border-teal-600 text-teal-600"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                AddNoteDescription(noteDescription, noteId);
                setCreateNoteDescriptionMode(false);
                setNoteDescription("");
              }}
              className="rounded-md py-2 px-4 bg-teal-600 text-slate-50"
            >
              Aceptar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setCreateNoteDescriptionMode(true);
          }}
          className="w-full rounded-md p-2 hover:bg-teal-500 hover:text-teal-50 bg-teal-50 text-teal-500 transition-colors border-dashed border-teal-500 border-2 flex justify-center items-center gap-2"
        >
          <FaPlus />
          <span>Agregar descripción</span>
        </button>
      )}
    </>
  );
}

export default AddNoteDescriptionCard;
