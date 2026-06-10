// import "./Home.css";
// import heroModel from "../Assets/character.png";

// function Home() {
//   return (
//     <div className="home-lay">
//       <div className="hero-section">
//         <div className="hero-image">
//           <img src={heroModel} alt="" />
//         </div>
//         <div className="hero-text">
//           <p>Discover now latest collection</p>
//           <h1>Summer collection 2026</h1>
//           <button>Shop now</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import "./Home.css";
import { useState, useEffect } from "react";

import heroModel1 from "../Assets/character1.png";
import heroModel2 from "../Assets/character2.png";
import heroModel3 from "../Assets/character3.png";
import MEN from "../Assets/MEN-fashion.jpg";
import WOMEN from "../Assets/WOMEN-fashion.jpg";
import KIDS from "../Assets/KIDS-fashion.jpg";
import shirt from "../Assets/shirt.png";
import heart from "../Assets/heart.png";
import bottomBanner from "../Assets/bottom-banner.png";

function Home() {
  const slides = [
    {
      image: heroModel1,
      subtitle: "Discover now latest collection",
      title: "Summer collection 2026",
    },
    {
      image: heroModel2,
      subtitle: "Explore the newest arrivals",
      title: "Winter collection 2026",
    },
    {
      image: heroModel3,
      subtitle: "Fresh fashion trends",
      title: "Autumn collection 2026",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-lay">
      <div className="hero-section">
        <div className="hero-image">
          <img src={slides[currentSlide].image} alt="" />
        </div>

        <div className="hero-text">
          <p>{slides[currentSlide].subtitle}</p>
          <h1>{slides[currentSlide].title}</h1>
          <button>Shop now</button>
        </div>
      </div>
      <div className="sub-items">
        <p>CURATED COLLECTION</p>
        <h2>FOR EVERY GENERATION</h2>
      </div>
      <div className="card-view">
        <div className="card-item">
          <img src={MEN} alt="men" />
          <p>MEN</p>
          <button>Show now</button>
        </div>
        <div className="card-item">
          <img src={WOMEN} alt="men" />
          <p>MEN</p>
          <button>Show now</button>
        </div>
        <div className="card-item">
          <img src={KIDS} alt="men" />
          <p>MEN</p>
          <button>Show now</button>
        </div>
      </div>
      <div className="bottom-banner">
        <img src={bottomBanner} alt="" />
        <div className="banner-text">
          <p>SIGNATURE STYLE</p>
          <h2>
            The Icons of <br></br> the Season
          </h2>
          <button>OUR STORY</button>
        </div>
        <div className="reviw">
          <span style={{ color: "#FFD700" }}>★★★★★</span>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export default Home;
