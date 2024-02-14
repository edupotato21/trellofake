import { useState, useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NoteCard from "./NoteCard";
import MenuDropdown from "./MenuDropdown";
import CreateNoteCard from "./CreateNoteCard";
import { FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";

NotesList.propTypes = {
  column: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
  AddNote: PropTypes.func.isRequired,
  activateModal: PropTypes.func.isRequired,
  removeColumn: PropTypes.func.isRequired,
  editColumnTitle: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
}

function NotesList({
  column,
  notes,
  AddNote,
  activateModal,
  removeColumn,
  editColumnTitle,
  deleteNote
}) {
  const [editTitleMode, setEditTitleMode] = useState(false);
  const notesId = useMemo(() => notes.map((note) => note.id), [notes]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editTitleMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[350px] min-w-[350px] rounded-md bg-teal-50 p-4 shadow-sm border-teal-500 border-2 opacity-50"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] min-w-[350px] rounded-md bg-teal-100 p-4 shadow-sm"
    >
      <div
        className="mb-2 flex items-center justify-between"
        {...attributes}
        {...listeners}
      >
        {editTitleMode ? (
          <input
            type="text"
            autoFocus
            className="w-full outline-teal-600 border-teal-600 bg-slate-50 text-xl font-semibold border-2 p-2 rounded-md"
            value={column.title}
            onChange={(e) => {
              editColumnTitle(column.id, e.target.value);
            }}
            onBlur={() => {
              setEditTitleMode(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditTitleMode(false);
              }
            }}
          />
        ) : (
          <div className="w-full text-xl font-semibold text-gray-800 py-2 border-teal-100 border-2 rounded-md">
            <h2 className="overflow-hidden">{column.title}</h2>
          </div>
        )}
        <MenuDropdown>
          <button
            className="hover:bg-slate-50 w-full px-4 py-2 text-gray-800"
            onClick={() => {
              setEditTitleMode(true);
            }}
          >
            Editar título
          </button>
          <hr />
          <button
            className="hover:bg-slate-50 w-full px-4 py-2 text-gray-800"
            onClick={() => {
              removeColumn(column.id);
            }}
          >
            Borrar columna
          </button>
        </MenuDropdown>
      </div>

      <div className="gap-2 flex flex-col">
        <SortableContext items={notesId}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} activateModal={activateModal} deleteNote={deleteNote} />
          ))}
          <CreateNoteCard AddNote={AddNote} columnId={column.id}>
            <FaPlus />
            <span>Añadir nota</span>
          </CreateNoteCard>
        </SortableContext>
      </div>
    </div>
  );
}

export default NotesList;
