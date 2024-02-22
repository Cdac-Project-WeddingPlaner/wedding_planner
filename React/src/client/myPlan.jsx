import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./myPlan.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import imgSrc from "../resourses/img.jpg";


function MyPlan() {
  const [weddingPlans, setWeddingPlans] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const user_id = user.user_id;
  const sessionToken = sessionStorage.getItem("token");
  const hallSectionRef = useRef(null);
  const cateringSectionRef = useRef(null);
  const decorationSectionRef = useRef(null);
  const musicSectionRef = useRef(null);
  const photographySectionRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [caterings, setcaterings] = useState([]);
  const [musics, setmusics] = useState([]);
  const [photography, setphotography] = useState([]);
  const [decorations, setdecorations] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  const currentTime = new Date().toISOString().split("T")[1].split(".")[0]; // Get current time in HH:MM:SS format

  useEffect(() => {
    if (user && user.user_id) {
      fetchWeddingPlans(user.user_id);
    }

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
  }, []);

  const fetchWeddingPlans = (userId) => {
    axios
      .get(`http://localhost:7777/wedsel/user/${userId}`, {
        headers: {
          "x-auth-token": sessionToken,
        },
      })
      .then((response) => {
        console.log(response);
        setWeddingPlans(response.data);
      })
      .catch((error) => console.error("Error fetching wedding plans:", error));
  };

  const renderActionButtons = (status, planId) => {
    if (status === "pending") {
      return <button onClick={() => handleRemove(planId)}>Remove</button>;
    } else if (status === "confirmed") {
      return <h5>Accepted</h5>;
    } else if (status === "rejected") {
      return (
        <div>
          <button>Re-request</button>
          <br />
          <button onClick={() => handleRemove(planId)}>Remove</button>
        </div>
      );
    }
  };

  const handleRemove = (planId) => {
    const selectionId = weddingPlans.find(
      (plan) => plan.plan_id === planId
    ).selection_id;

    const requestBody = {
      selection_id: selectionId,
      plan_id: planId,
    };

    axios
      .delete(`http://localhost:7777/wedsel/p/plans`, {
        data: requestBody,
        headers: {
          "x-auth-token": sessionToken,
        },
      })
      .then((response) => {
        console.log(response.data);
        fetchWeddingPlans(user.user_id);
        // Handle success
      })
      .catch((error) => {
        console.error("Error deleting plan selection:", error);
      });
  };

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const prevSlide = () => {
    document.getElementById("slide-container").scrollLeft -= 300; // Adjust scroll distance
  };

  const nextSlide = () => {
    document.getElementById("slide-container").scrollLeft += 300; // Adjust scroll distance
  };

  const addPlan = (planId) => {
    // Check if the plan already exists in the list
    if (weddingPlans.some((plan) => plan.plan_id === planId)) {
      toast.error("Plan is already added");
      return; // Exit the function if the plan already exists
    }

    // Now add the plan to the wedding plan selection
    axios
      .post(
        `http://localhost:7777/wedsel/plans/${user_id}`,
        {
          plan_id: planId,
          date: currentDate,
          time: currentTime, // Replace with the desired time
        },
        {
          headers: {
            "x-auth-token": sessionToken,
          },
        }
      )
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
      <div className="heading">
        <h1>Summary</h1>
      </div>
      <table className="event-plan" border={1}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Price</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {weddingPlans.some((plan) => plan.service_type === "Hall") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Hall")
              .map((plan) => (
                <tr key={plan.plan_id}>
                  <th className="sub-heading">Hall</th>
                  <td>{plan.title}</td>
                  <td>{plan.price}</td>
                  <td>{new Date(new Date(plan.date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                  <td>{plan.status}</td>
                  <td>{renderActionButtons(plan.status, plan.plan_id)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <th className="sub-heading">Hall</th>
              <td colSpan={5}>
                <button onClick={() => scrollToSection(hallSectionRef)}>
                  Add Hall Plan
                </button>
              </td>
            </tr>
          )}
          {weddingPlans.some((plan) => plan.service_type === "Catering") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Catering")
              .map((plan) => (
                <tr key={plan.plan_id}>
                  <th className="sub-heading">Catering</th>
                  <td>{plan.title}</td>
                  <td>{plan.price}</td>
                  <td>{new Date(new Date(plan.date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                  <td>{plan.status}</td>
                  <td>{renderActionButtons(plan.status, plan.plan_id)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <th className="sub-heading">Catering</th>
              <td colSpan={6}>
                <button onClick={() => scrollToSection(cateringSectionRef)}>
                  Add Catering Plan
                </button>
              </td>
            </tr>
          )}

          {weddingPlans.some((plan) => plan.service_type === "Decoration") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Decoration")
              .map((plan) => (
                <tr key={plan.plan_id}>
                  <th className="sub-heading">Decoration</th>
                  <td>{plan.title}</td>
                  <td>{plan.price}</td>
                  <td>{new Date(new Date(plan.date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                  <td>{plan.status}</td>
                  <td>{renderActionButtons(plan.status, plan.plan_id)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <th className="sub-heading">Decoration</th>
              <td colSpan={6}>
                <button onClick={() => scrollToSection(decorationSectionRef)}>
                  Add Decoration Plan
                </button>
              </td>
            </tr>
          )}

          {weddingPlans.some((plan) => plan.service_type === "Music") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Music")
              .map((plan) => (
                <tr key={plan.plan_id}>
                  <th className="sub-heading">Music</th>
                  <td>{plan.title}</td>
                  <td>{plan.price}</td>
                  <td>{new Date(new Date(plan.date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                  <td>{plan.status}</td>
                  <td>{renderActionButtons(plan.status, plan.plan_id)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <th className="sub-heading">Music</th>
              <td colSpan={6}>
                <button onClick={() => scrollToSection(musicSectionRef)}>
                  Add Music Plan
                </button>
              </td>
            </tr>
          )}

          {weddingPlans.some((plan) => plan.service_type === "Photography") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Photography")
              .map((plan) => (
                <tr key={plan.plan_id}>
                  <th className="sub-heading">Photography</th>
                  <td>{plan.title}</td>
                  <td>{plan.price}</td>
                  <td>{new Date(new Date(plan.date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                  <td>{plan.status}</td>
                  <td>{renderActionButtons(plan.status, plan.plan_id)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <th className="sub-heading">Photography</th>
              <td colSpan={6}>
                <button onClick={() => scrollToSection(photographySectionRef)}>
                  Add Photography Plan
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="total">
        <div>
          Total Price :{" "}
          {weddingPlans.reduce(
            (total, plan) => total + parseFloat(plan.price),
            0
          )}
        </div>
      </div>
      <button className="pay-button">Pay</button>

      <section ref={hallSectionRef}>
        <div className="heading">
          <h1>Halls</h1>
        </div>

        <div className="hal-container">
          {weddingPlans.some((plan) => plan.service_type === "Hall") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Hall")
              .map((plan) => (
                <div className="plan" key={plan.plan_id}>
                  <img src={imgSrc} className="planimage" />
                  <div className="hall-details">
                    <h3>Hall Name : {plan.title}</h3>
                    <h3>Price : {plan.price}</h3>
                    <h3>Status : {plan.status}</h3>
                    <div className="remove">
                      {renderActionButtons(plan.status, plan.plan_id)}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="slider">
              <button className="arrow arrow-left" onClick={prevSlide}>
                <FaArrowLeft />
              </button>
              <div className="slides" id="slide-container">
                {plans.map((plan) => (
                  <div className="slide" key={plan.plan_id}>
                    <img src={imgSrc} className="image" />
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
          )}
        </div>
      </section>

      <section ref={cateringSectionRef}>
        <div className="heading">
          <h1>Catering</h1>
        </div>

        <div className="hal-container">
          {weddingPlans.some((plan) => plan.service_type === "Catering") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Catering")
              .map((plan) => (
                <div className="plan" key={plan.plan_id}>
                  <img src={imgSrc} className="planimage" />
                  <div className="hall-details">
                    <h3>Catering Name : {plan.title}</h3>
                    <h3>Price : {plan.price}</h3>
                    <h3>Status : {plan.status}</h3>
                    <div className="remove">
                      {renderActionButtons(plan.status, plan.plan_id)}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="slider">
              <button className="arrow arrow-left" onClick={prevSlide}>
                <FaArrowLeft />
              </button>
              <div className="slides" id="slide-container">
                {caterings.map((catering) => (
                  <div className="slide" key={catering.plan_id}>
                    <img src={imgSrc} className="image" />
                    <h3>{catering.title}</h3>
                    <h4>{catering.description}</h4>
                    <h4>Price : {catering.price} /-</h4>
                    <button
                      className="add-button"
                      onClick={() => addPlan(catering.plan_id)}>
                      Add
                    </button>
                  </div>
                ))}
              </div>
              <button className="arrow arrow-right" onClick={nextSlide}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section ref={decorationSectionRef}>
        <div className="heading">
          <h1>Decorations</h1>
        </div>

        <div className="hal-container">
          {weddingPlans.some((plan) => plan.service_type === "Decoration") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Decoration")
              .map((plan) => (
                <div className="plan" key={plan.plan_id}>
                  <img src={imgSrc} className="planimage" />
                  <div className="hall-details">
                    <h3>Decoration Name : {plan.title}</h3>
                    <h3>Price : {plan.price}</h3>
                    <h3>Status : {plan.status}</h3>
                    <div className="remove">
                      {renderActionButtons(plan.status, plan.plan_id)}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="slider">
              <button className="arrow arrow-left" onClick={prevSlide}>
                <FaArrowLeft />
              </button>
              <div className="slides" id="slide-container">
                {decorations.map((decoration) => (
                  <div className="slide" key={decoration.plan_id}>
                    <img src={imgSrc} className="image" />
                    <h3>{decoration.title}</h3>
                    <h4>{decoration.description}</h4>
                    <h4>Price : {decoration.price} /-</h4>
                    <button
                      className="add-button"
                      onClick={() => addPlan(decoration.plan_id)}>
                      Add
                    </button>
                  </div>
                ))}
              </div>
              <button className="arrow arrow-right" onClick={nextSlide}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section ref={musicSectionRef}>
        <div className="heading">
          <h1>Music</h1>
        </div>

        <div className="hal-container">
          {weddingPlans.some((plan) => plan.service_type === "Music") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Music")
              .map((plan) => (
                <div className="plan" key={plan.plan_id}>
                  <img src={imgSrc} className="planimage" />
                  <div className="hall-details">
                    <h3>Music Name : {plan.title}</h3>
                    <h3>Price : {plan.price}</h3>
                    <h3>Status : {plan.status}</h3>
                    <div className="remove">
                      {renderActionButtons(plan.status, plan.plan_id)}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="slider">
              <button className="arrow arrow-left" onClick={prevSlide}>
                <FaArrowLeft />
              </button>
              <div className="slides" id="slide-container">
                {musics.map((music) => (
                  <div className="slide" key={music.plan_id}>
                    <img src={imgSrc} className="image" />
                    <h3>{music.title}</h3>
                    <h4>{music.description}</h4>
                    <h4>Price : {music.price} /-</h4>
                    <button
                      className="add-button"
                      onClick={() => addPlan(music.plan_id)}>
                      Add
                    </button>
                  </div>
                ))}
              </div>
              <button className="arrow arrow-right" onClick={nextSlide}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section ref={photographySectionRef}>
        <div className="heading">
          <h1>Photography</h1>
        </div>

        <div className="hal-container">
          {weddingPlans.some((plan) => plan.service_type === "Photography") ? (
            weddingPlans
              .filter((plan) => plan.service_type === "Photography")
              .map((plan) => (
                <div className="plan" key={plan.plan_id}>
                  <img src={imgSrc} className="planimage" />
                  <div className="hall-details">
                    <h3>Photography Name : {plan.title}</h3>
                    <h3>Price : {plan.price}</h3>
                    <h3>Status : {plan.status}</h3>
                    <div className="remove">
                      {renderActionButtons(plan.status, plan.plan_id)}
                    </div>
                  </div>
                </div>
              ))
          ) : (
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
                    </button>
                  </div>
                ))}
              </div>
              <button className="arrow arrow-right" onClick={nextSlide}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyPlan;
