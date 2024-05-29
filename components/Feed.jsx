"use client";

import { Select, MenuItem } from "@mui/material"; // Імпорт компонентів Material-UI
import { categories } from "@data";
import ModList from "./ModList";
import { useEffect, useState } from "react";
import "@styles/Categories.scss";
import Loader from "./Loader";

const Feed = () => {
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [modList, setModList] = useState([]);

  const [sortType, setSortType] = useState("None");

  const getModList = async () => {
    const response = await fetch(`/api/mod/list/${selectedCategory}`);
    const data = await response.json();
    setModList(data);
    setLoading(false);
  };

  useEffect(() => {
    getModList();
  }, [selectedCategory]);
  
  //const sortedModList = modList.slice().sort((a, b) => b.downloads - a.downloads);

  const handleSortChange = (event) => {
    setSortType(event.target.value); // Оновлення типу сортування при зміні випадаючого списку
  };

  // Сортування модулів відповідно до типу сортування
  const sortedModList = modList.slice().sort((a, b) => {
    if (sortType === "Downloads") {
      return b.downloads - a.downloads;
    } else {
      return modList;
    }
  });


  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="categories">
        {categories?.map((item, index) => (
          <p
            onClick={() => setSelectedCategory(item)}
            className={`${item === selectedCategory ? "selected" : ""}`}
            key={index}
          >
            {item}
          </p>
        ))}
      </div>

        {/* Додано випадаючий список для вибору типу сортування */}
      
      <div className="sort">
        <p>Sorting by</p>
        <Select value={sortType} onChange={handleSortChange}>
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Downloads">Number of downloads</MenuItem>
        </Select>
      </div>

      <ModList data={sortedModList}/>
    </>
  );
};

export default Feed;
