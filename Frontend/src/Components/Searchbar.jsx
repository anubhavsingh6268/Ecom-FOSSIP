// import React from "react";
// import searchIcon from "../Assets/Search.png";
// import "../Components/Searchbar.css";

// const Searchbar = () => {
//   return (
//     <div id="Search-bar">
//       <img src={searchIcon} alt="searchbar" />
//       <input type="text" placeholder="Search" />
//     </div>
//   );
// };

// export default Searchbar;

import React from "react";
import searchIcon from "../Assets/Search.png";
import "./Searchbar.css";

const Searchbar = () => {
  return (
    <div id="Search-bar">
      <img src={searchIcon} alt="search" />
      <input type="text" placeholder="Search..." />
    </div>
  );
};

export default Searchbar;
