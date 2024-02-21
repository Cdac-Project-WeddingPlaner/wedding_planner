import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./Slider.css"; // Import CSS file

function Home() {
  const [plans, setPlans] = useState([]);
  const [caterings, setcaterings] = useState([]);
  const [musics, setmusics] = useState([]);
  const [packages, setpackages] = useState([]);
  const [photography, setphotography] = useState([]);
  const [decorations, setdecorations] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const user_id = user.user_id;
  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  const currentTime = new Date().toISOString().split("T")[1].split(".")[0]; // Get current time in HH:MM:SS format
  const sessionToken = sessionStorage.getItem('token');


  useEffect(() => {
    axios
      .get("http://localhost:7777/plans/service/hall")
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/catering")
      .then((response) => {
        setcaterings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching catering:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/music")
      .then((response) => {
        setmusics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Music:", error);
      });

    axios
      .get("http://localhost:7777/packages")
      .then((response) => {
        setpackages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Packages:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/photography")
      .then((response) => {
        setphotography(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Photography:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/decoration")
      .then((response) => {
        setdecorations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Decorations:", error);
      });

      fetchWeddingPlans(user_id);
  }, []);

  const prevSlide = () => {
    document.getElementById("slide-container").scrollLeft -= 300; // Adjust scroll distance
  };

  const nextSlide = () => {
    document.getElementById("slide-container").scrollLeft += 300; // Adjust scroll distance
  };
    
  const fetchWeddingPlans = (userId) => {
    axios
      .get(`http://localhost:7777/wedsel/user/${userId}`, {
        headers: {
          "x-auth-token": sessionToken,
        },
      })
      .then((response) => {
        console.log(response);
        setUserPlans(response.data);
      })
      .catch((error) => console.error("Error fetching wedding plans:", error));
  };

  // Function to add a plan
  // Function to add a plan
const addPlan = (planId) => {
  // Check if the plan already exists in the list
  if (userPlans.some((plan) => plan.plan_id === planId)) {
    toast.error("Plan is already added");
    return; // Exit the function if the plan already exists
  }

  // Now add the plan to the wedding plan selection
  axios
    .post(`http://localhost:7777/wedsel/plans/${user_id}`, {
      plan_id: planId,
      date: currentDate,
      time: currentTime, // Replace with the desired time
    },
    {
      headers: {
        "x-auth-token": sessionToken,
      }
    })
    .then((planResponse) => {
      // Handle success
      console.log("Plan added successfully:", planResponse.data);
      fetchWeddingPlans(user_id);
      toast.success("Plan added successfully");

    })
    .catch((planError) => {
      console.error("Error adding plan:", planError);
      toast.error("Error adding plan");
    });
};

  return (
    <div>
      <ToastContainer /> {/* Toast container */}
      <div className="heading">
        <h1>Halls</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {plans.map((plan) => (
            <div className="slide" key={plan.plan_id}>
              <img src="img.jpg" className="image" />
              <h3>{plan.title}</h3>
              <h4>{plan.description}</h4>
              <h4>Price : {plan.price} /-</h4>
              <button
                className="add-button"
                onClick={() => addPlan(plan.plan_id)}>
                Add
              </button>
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>

      {/* -----------------Catering-------------------- */}

      <div className="heading">
        <h1>Catering</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {caterings.map((catering) => (
            <div className="slide" key={catering.plan_id}>
              <img src="img.jpg" className="image" />
              <h3>{catering.title}</h3>
              <h4>{catering.description}</h4>
              <h4>Price : {catering.price} /-</h4>
              <button
                className="add-button"
                onClick={() => addPlan(catering.plan_id)}>
                Add
              </button>{" "}
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>

      {/* -----------------Music-------------------- */}

      <div className="heading">
        <h1>Music</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {musics.map((music) => (
            <div className="slide" key={music.plan_id}>
              <img src="img.jpg" className="image" />
              <h3>{music.title}</h3>
              <h4>{music.description}</h4>
              <h4>Price : {music.price} /-</h4>
              <button
                className="add-button"
                onClick={() => addPlan(music.plan_id)}>
                Add
              </button>{" "}
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>

      {/* -----------------Photography-------------------- */}

      <div className="heading">
        <h1>Photography</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {photography.map((photo) => (
            <div className="slide" key={photo.plan_id}>
              <img src="img.jpg" className="image" />
              <h3>{photo.title}</h3>
              <h4>{photo.description}</h4>
              <h4>Price : {photo.price} /-</h4>
              <button
                className="add-button"
                onClick={() => addPlan(photo.plan_id)}>
                Add
              </button>{" "}
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>

      {/* -----------------Decoration-------------------- */}

      <div className="heading">
        <h1>Decorations</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {decorations.map((decoration) => (
            <div className="slide" key={decoration.plan_id}>
              <img src="img.jpg" className="image" />
              <h3>{decoration.title}</h3>
              <h4>{decoration.description}</h4>
              <h4>Price : {decoration.price} /-</h4>
              <button
                className="add-button"
                onClick={() => addPlan(decoration.plan_id)}>
                Add
              </button>{" "}
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>

      {/* -----------------Packages-------------------- */}

      <div className="heading">
        <h1>Packages</h1>
      </div>
      <div className="slider">
        <button className="arrow arrow-left" onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className="slides" id="slide-container">
          {packages.map((pack) => (
            <div className="slide" key={pack.package_id}>
              <img src="img.jpg" className="image" />
              <h3>{pack.packagename}</h3>
              {/* <h4>{pack.description}</h4>
            <h4>Price : {pack.price} /-</h4> */}
              <button
                className="add-button"
                onClick={() => addPlan(pack.plan_id)}>
                Add
              </button>{" "}
            </div>
          ))}
        </div>
        <button className="arrow arrow-right" onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Home;
