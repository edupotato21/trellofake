import { useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import PropTypes from "prop-types";

MenuDropdown.propTypes = {
  children: PropTypes.node.isRequired,
}

function MenuDropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-teal-100 text-neutral-900 p-2 rounded-full hover:text-neutral-700 transition-colors">
        <BsThreeDotsVertical />
      </button>
      {isOpen && (
        <div className="absolute top-10 right-0 bg-white shadow-md rounded-md min-w-[150px]" onClick={() => setIsOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown