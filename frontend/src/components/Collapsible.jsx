import React, { useState } from "react";

const Collapsible = ({ label, options, defaultValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]);

  const handleChange = (value) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="w-fit">
      {/* Collapsible Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className=" flex gap-4 font-bold hover:bg-[hsl(219,76%,13%)] bg-blue-500 cursor-pointer w-fit justify-between items-center rounded p-2"
      >
        <span>{label}</span>
        <span className="font-medium capitalize">{selected}</span>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="absolute bg-black/50 flex items-start justify-center w-screen h-screen top-0 left-0">
          <div className="mt-2 rounded border w-fit space-y-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center px-4 py-1 space-x-2 w-full hover:bg-[hsl(219,76%,13%)]"
              >
                <input
                  type="radio"
                  name={label}
                  value={option}
                  checked={selected === option}
                  onChange={(e) => handleChange(e.target.value)}
                />
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
          <div
            className="mx-4 py-4 cursor-pointer"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            X
          </div>
        </div>
      )}
    </div>
  );
};

export default Collapsible;
