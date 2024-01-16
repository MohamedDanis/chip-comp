"use client"
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
interface Option {
  id: number;
  name: string;
  profile: string;
  email: string;
}

export default function Home() {
  const [selected, setSelected] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<Option[]>([
    {
      id: 1,
      name: "John",
      profile: "/imgs/avatar1.jpg",
      email: "john@email.com",
    },
    {
      id: 2,
      name: "dani",
      profile: "/imgs/avatar2.jpg",
      email: "dani@email.com",
    },
    {
      id: 3,
      name: "shahi",
      profile: "/imgs/avatar3.jpg",
      email: "shahi@email.com",
    },
    {
      id: 4,
      name: "abhi",
      profile: "/imgs/avatar4.jpg",
      email: "abhi@email.com",
    },
    {
      id: 5,
      name: "amar",
      profile: "/imgs/avatar1.jpg",
      email: "amr@email.com",
    },
    {
      id: 6,
      name: "binu",
      profile: "/imgs/avatar2.jpg",
      email: "binu@email.com",
    },
    {
      id: 7,
      name: "binu2",
      profile: "/imgs/avatar2.jpg",
      email: "binu@email.com",
    },
  ]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setHighlightIndex(-1);
    setInputFocused(false);
  };

  const handleMouseEnter = (index: number) => {
    setHighlightIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightIndex(-1);
  };

  const handleSelect = (option: Option) => {
    const newSelected = [...selected];
    if (newSelected.find((o) => o.id === option.id)) {
      newSelected.splice(
        newSelected.findIndex((o) => o.id === option.id),
        1
      );
    } else {
      newSelected.push(option);
    }
    setSelected(newSelected);
    if (inputRef.current) {
      inputRef.current.focus();
      setSearch("");
    }
  };

  const handleDeselect = (option: Option) => {
    const newSelected = [...selected];
    newSelected.splice(
      newSelected.findIndex((o) => o.id === option.id),
      1
    );
    setSelected(newSelected);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!inputFocused) return;
    if (e.key === "ArrowDown") {
      setHighlightIndex(
        (prevIndex) => (prevIndex + 1) % filteredOptions.length
      );
      if (optionsRef.current) {
        optionsRef.current.scrollTo({
          top: (highlightIndex + 1) * 60,
          behavior: 'smooth'
        });
      }
    } else if (e.key === "ArrowUp") {
      setHighlightIndex(
        (prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length
      );
      if (optionsRef.current) {
        optionsRef.current.scrollTo({
          top: (highlightIndex - 1) * 60,
          behavior: 'smooth'
        });
      }
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      const option = filteredOptions[highlightIndex];

      handleSelect(option);
    } else if (e.key === "Backspace" && search === "") {
      setDeleteIndex(selected.length - 1);
    }
  };

  const handleDelete = (option: Option) => {
    const newSelected = [...selected];
    newSelected.splice(
      newSelected.findIndex((o) => o.id === option.id),
      1
    );
    setSelected(newSelected);
  };

  useEffect(() => {
    if (deleteIndex >= 0) {
      const option = selected[deleteIndex];
      handleDelete(option);
      setDeleteIndex(-1);
    }
  }, [deleteIndex]);

  const filteredOptions = options.filter((o) => {
    return (
      !selected.find((s) => s.id === o.id) &&
      o.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="w-full h-screen bg-slate-100 flex flex-col items-center gap-y-12 justify-center">
      <div className="w-full flex flex-col items-center justify-center max-w-[400px] mx-auto relative">
        <div
          className="flex flex-wrap p-2 bg-white gap-y-3 w-full  border-b-2 border-blue-800"
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          {selected.map((option, index) => (
            <div
              key={option.id}
              className={`${
                index === deleteIndex ? "bg-gray-200" : ""
              } mr-2 px-2 py-1 bg-gray-300 text-gray-700 rounded-full flex items-center`}
            >
              <Image
                src={option.profile}
                className="rounded-full mr-3"
                width={30}
                height={30}
                alt="img"
              />

              {option.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-2 cursor-pointer w-4 h-4"
                onClick={() => handleDeselect(option)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          ))}
          <input
            className="outline-none flex-1 text-black w-[60px] bg-none "
            value={search}
            ref={inputRef}
            onClick={() => setShowOptions(true)}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
        </div>
        {showOptions && (
          <div className="w-full mt-3">
            <div
              className="border p-2 text-black w-full rounded-md outline-none"
              style={{ maxHeight: "200px", overflowY: "auto" }}
              ref={optionsRef} 
            >
              {filteredOptions.map((option, index) => (
                <div
                  className={`${
                    highlightIndex === index ? "bg-gray-200" : ""
                  } p-2 hover:bg-gray-300 flex gap-2 items-center justify-between cursor-pointer`}
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={option.profile}
                      className="rounded-full"
                      width={50}
                      height={50}
                      alt="img"
                    />
                    {option.name}
                  </div>
                  <p className="text-gray-400">{option.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
