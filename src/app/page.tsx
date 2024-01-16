"use client"
import Image from "next/image";
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Option {
  id: number;
  name: string;
  profile:string;
}
import img from '../../public/imgs/avatar1.jpg'

export default function Home() {
  const [selected, setSelected] = useState<Option[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<Option[]>([
    { id: 1, name: "John",profile:'/imgs/avatar1.jpg' },
    { id: 2, name: "dani",profile:'/imgs/avatar2.jpg' },
    { id: 3, name: "shahi",profile:'/imgs/avatar3.jpg' },
    { id: 4, name: "abhi",profile:'/imgs/avatar4.jpg' },
    { id: 5, name: "amar",profile:'/imgs/avatar1.jpg' },
    { id: 6, name: "binu",profile:'/imgs/avatar2.jpg' },
  ]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteIndex, setDeleteIndex] = useState(-1);

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
    if (e.key === "Backspace" && search === "") {
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
        <div className="flex flex-wrap p-2 bg-white gap-y-3 w-full  border-b-2 border-blue-800" onKeyDown={handleKeyDown} >
          {selected.map((option, index) => (
            <div
              key={option.id}
              className={`${index === deleteIndex ? "bg-gray-200" : ""} mr-2 px-2 py-1 bg-blue-800 rounded-full flex items-center`}
            >
              {option.name}
              <span
                className="ml-2 cursor-pointer"
                onClick={() => handleDeselect(option)}
              >
                x
              </span>
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
            <select className="border p-2 text-black w-full rounded-md outline-none" multiple>
              {filteredOptions.map((option) => (
                <option
                  className="p-2 hover:bg-gray-100 flex gap-2"
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  selected={!!selected.find((o) => o.id === option.id)}
                >
                  <div className="bg-[url('../../public/imgs/avatar1.jpg')] rounded-full w-14 h-14"></div>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        )}
       
      </div>
    </div>
  );
}
