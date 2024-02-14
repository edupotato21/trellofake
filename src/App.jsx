import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import NotesList from "./components/NotesList";
import NoteCard from "./components/NoteCard";
import CreateColumnCard from "./components/CreateColumnCard";
import { MdClose } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import AddNoteDescriptionCard from "./components/AddNoteDescriptionCard";
import Header from "./components/Header";

function App() {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [notes, setNotes] = useState([]);

  const [activeColumn, setActiveColumn] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [activeModal, setActiveModal] = useState(false);
  const [modalNote, setModalNote] = useState(null);
  const [modalEditDescription, setModalEditDescription] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const activateModal = (note) => {
    setModalNote(note);
    setActiveModal(true);
  };

  const onDragStart = (event) => {
    console.log(event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Note") {
      setActiveNote(event.active.data.current.note);
      return;
    }
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    setActiveNote(null);
    const { active, over } = event;

    if (!over) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === active.id);
      const overIndex = columns.findIndex((col) => col.id === over.id);

      return arrayMove(columns, activeIndex, overIndex);
    });
  };

  const onDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveANote = active.data.current?.type === "Note";
    const isOverANote = over.data.current?.type === "Note";

    if (!isActiveANote) return;

    if (isActiveANote && isOverANote) {
      setNotes((notes) => {
        const activeIndex = notes.findIndex((note) => note.id === activeId);
        const overIndex = notes.findIndex((note) => note.id === overId);

        if (notes[activeIndex].columnId !== notes[overIndex].columnId) {
          notes[activeIndex].columnId = notes[overIndex].columnId;
          return arrayMove(notes, activeIndex, overIndex - 1);
        }
        return arrayMove(notes, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveANote && isOverAColumn) {
      setNotes((note) => {
        const activeIndex = note.findIndex((n) => n.id === activeId);

        note[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(note, activeIndex, activeIndex);
      });
    }
  };

  function AddNote(columnId, title) {
    const newNote = {
      id: generateUniqueId(),
      columnId,
      title: title,
      description: null,
    };

    setNotes([...notes, newNote]);
  }

  function DeleteNote(noteId) {
    setNotes((notes) => notes.filter((note) => note.id !== noteId));
  }

  function AddNoteDescription(description, noteId) {
    setNotes((notes) =>
      notes.map((note) => {
        if (note.id === noteId) {
          note.description = description;
        }
        return note;
      })
    );
  }

  function AddColumn(title) {
    const newColumn = {
      id: generateUniqueId(),
      title: title,
    };

    setColumns([...columns, newColumn]);
  }

  function removeColumn(columnId) {
    setColumns((columns) => columns.filter((col) => col.id !== columnId));
    setNotes((notes) => notes.filter((note) => note.columnId !== columnId));
  }

  function editColumnTitle(columnId, newTitle) {
    setColumns((columns) =>
      columns.map((col) => {
        if (col.id === columnId) {
          col.title = newTitle;
        }
        return col;
      })
    );
  }

  return (
    <>
      <Header />
      <div
        className="
        pt-16
        min-h-screen
        w-full
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        mt-[-64px]"
        id="container"
      >
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <div className="mx-auto pt-8">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((column) => (
                  <NotesList
                    key={column.id}
                    column={column}
                    notes={notes.filter((note) => note.columnId === column.id)}
                    AddNote={AddNote}
                    removeColumn={removeColumn}
                    editColumnTitle={editColumnTitle}
                    activateModal={activateModal}
                    deleteNote={DeleteNote}
                  />
                ))}
                <CreateColumnCard AddColumn={AddColumn}>
                  <FaPlus />
                  <span>Añadir columna</span>
                </CreateColumnCard>
              </SortableContext>
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <NotesList
                  column={activeColumn}
                  notes={notes.filter(
                    (note) => note.columnId === activeColumn.id
                  )}
                  AddNote={AddNote}
                  removeColumn={removeColumn}
                />
              )}
              {activeNote && <NoteCard note={activeNote} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white p-4 rounded-md w-1/2">
            <button
              onClick={() => {
                setActiveModal(false);
                setActiveNote(null);
                setModalEditDescription(false);
              }}
              className="absolute top-2 right-2 hover:bg-slate-50 p-2 rounded-full transition-colors"
            >
              <MdClose />
            </button>
            <div className="mt-2">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {modalNote.title}
              </h2>
              <div className="mt-2">
                {!modalNote.description && (
                  <AddNoteDescriptionCard
                    AddNoteDescription={AddNoteDescription}
                    noteId={modalNote.id}
                  />
                )}
                {modalNote.description && modalEditDescription ? (
                  <div>
                    <textarea
                      value={modalNote.description}
                      autoFocus
                      onChange={(e) => {
                        setModalNote({
                          ...modalNote,
                          description: e.target.value,
                        });
                      }}
                      className="w-full rounded-md p-2 border-2 border-slate-500"
                    ></textarea>
                    <button
                      onClick={() => {
                        AddNoteDescription(modalNote.description, modalNote.id);
                        setModalEditDescription(false);
                      }}
                      className="w-full rounded-md p-2 hover:bg-teal-500 hover:text-teal-50 bg-teal-50 text-teal-500 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                ) : (
                  <div onClick={() => setModalEditDescription(true)}>
                    <p className="text-base text-gray-800">
                      {modalNote.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

const generateUniqueId = () => Math.random().toString(36).substring(7);
