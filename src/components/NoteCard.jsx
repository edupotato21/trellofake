import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BsTextLeft } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import PropTypes from "prop-types";

NoteCard.propTypes = {
  note: PropTypes.object.isRequired,
  activateModal: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
};

function NoteCard({ note, activateModal, deleteNote }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      type: "Note",
      note,
    },
    disabled: false,
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
        className="w-full rounded-md px-4 py-2 shadow-sm bg-teal-50 border-teal-500 border-2 opacity-50"
      >
        <h3 className="opacity-0">{note.title}</h3>
        {note.description && <BsTextLeft opacity={0} />}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group w-full rounded-md shadow-sm bg-white text-gray-800 relative"
    >
      <div
        className="group-hover:text-slate-600 px-4 py-2"
        onClick={() => activateModal(note)}
      >
        <h3>{note.title}</h3>
        {note.description && <BsTextLeft />}
      </div>
      <div className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 transition-opacity">
        <button
          onClick={() => deleteNote(note.id)}
          className="hover:bg-slate-100 p-1 rounded-full transition-colors"
        >
          <MdClose />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
