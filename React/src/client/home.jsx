// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Home() {
//   const [packages, setPackages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchPackages = async () => {
//         try {
//           const response = await fetch('http://localhost:7777/packages');
//           if (!response.ok) {
//             throw new Error('Failed to fetch packages');
//           }
//           const data = await response.json();
//           setPackages(data);
//         } catch (error) {
//           console.error('Error fetching packages:', error);
//         }
//       };
      

//     fetchPackages();
//   }, []);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => {
//       return prevIndex === 0 ? packages.length - 3 : prevIndex - 1;
//     });
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => {
//       return prevIndex === packages.length - 3 ? 0 : prevIndex + 1;
//     });
//   };

//   return (
//     <div className="slider">
//       <div className="slides" style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}>
//         {packages.map((pkg, index) => ( // Changed variable name from 'package' to 'pkg'
//           <div className="slide" key={index}>
//             <h2>{pkg.title}</h2>
//             <p>{pkg.description}</p>
//             <p>Price: {pkg.price}</p>
//           </div>
//         ))}
//       </div>
//       <button className="prev" onClick={prevSlide}>Previous</button>
//       <button className="next" onClick={nextSlide}>Next</button>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Slider.css'; // Import CSS file

function Home() {
  const [plans, setPlans] = useState([]);
  const [caterings, setcaterings] = useState([]);
  const [musics, setmusics] = useState([]);
  const [packages, setpackages] = useState([]);
  const [photography, setphotography] = useState([]);
  const [decorations, setdecorations] = useState([]);


  useEffect(() => {

    axios.get('http://localhost:7777/plans/service/hall')
      .then(response => {
        setPlans(response.data);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
      });

      axios.get('http://localhost:7777/plans/service/catering')
      .then(response => {
        setcaterings(response.data);
      })
      .catch(error => {
        console.error('Error fetching catering:', error);
      });

      axios.get('http://localhost:7777/plans/service/music')
      .then(response => {
        setmusics(response.data);
      })
      .catch(error => {
        console.error('Error fetching Music:', error);
      });

      axios.get('http://localhost:7777/packages')
      .then(response => {
        setpackages(response.data);
      })
      .catch(error => {
        console.error('Error fetching Packages:', error);
      });

      axios.get('http://localhost:7777/plans/service/photography')
      .then(response => {
        setphotography(response.data);
      })
      .catch(error => {
        console.error('Error fetching Photography:', error);
      });

      axios.get('http://localhost:7777/plans/service/decoration')
      .then(response => {
        setdecorations(response.data);
      })
      .catch(error => {
        console.error('Error fetching Decorations:', error);
      });
        
  }, []);

  const prevSlide = () => {
    document.getElementById("slide-container").scrollLeft -= 300; // Adjust scroll distance
  };

  const nextSlide = () => {
    document.getElementById("slide-container").scrollLeft += 300; // Adjust scroll distance
  };

  return (<div>
    <div className="heading">
    <h1>Halls</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {plans.map(plan => (
          <div className="slide" key={plan.plan_id}>
            <img src='img.jpg' className='image'/>
            <h3>{plan.title}</h3>
            <h4>{plan.description}</h4>
            <h4>Price : {plan.price} /-</h4>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>

    {/* -----------------Catering-------------------- */}

    <div className="heading">
    <h1>Catering</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {caterings.map(catering => (
          <div className="slide" key={catering.plan_id}>
            <img src='img.jpg' className='image'/>
            <h3>{catering.title}</h3>
            <h4>{catering.description}</h4>
            <h4>Price : {catering.price} /-</h4>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>

    {/* -----------------Music-------------------- */}

    <div className="heading">
    <h1>Music</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {musics.map(music => (
          <div className="slide" key={music.plan_id}>
            <img src='img.jpg' className='image'/>
            <h3>{music.title}</h3>
            <h4>{music.description}</h4>
            <h4>Price : {music.price} /-</h4>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>

    {/* -----------------Photography-------------------- */}

    <div className="heading">
    <h1>Photography</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {photography.map(photo => (
          <div className="slide" key={photo.plan_id}>
            <img src='img.jpg' className='image'/>
            <h3>{photo.title}</h3>
            <h4>{photo.description}</h4>
            <h4>Price : {photo.price} /-</h4>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>

    {/* -----------------Decoration-------------------- */}

    <div className="heading">
    <h1>Decorations</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {decorations.map(decoration => (
          <div className="slide" key={decoration.plan_id}>
            <img src='img.jpg' className='image'/>
            <h3>{decoration.title}</h3>
            <h4>{decoration.description}</h4>
            <h4>Price : {decoration.price} /-</h4>
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>

    {/* -----------------Packages-------------------- */}

    <div className="heading">
    <h1>Packages</h1>
    </div>
    <div className="slider">
      <button className="arrow arrow-left" onClick={prevSlide}><FaArrowLeft /></button>
      <div className="slides" id="slide-container">
        {packages.map(pack => (
          <div className="slide" key={pack.package_id}>
            <img src='img.jpg' className='image'/>
            <h3>{pack.packagename}</h3>
            {/* <h4>{photo.description}</h4>
            <h4>Price : {photo.price} /-</h4> */}
            <button className="add-button">Add</button>
          </div>
        ))}
      </div>
      <button className="arrow arrow-right" onClick={nextSlide}><FaArrowRight /></button>
    </div>
    </div>
  );
}

export default Home;
