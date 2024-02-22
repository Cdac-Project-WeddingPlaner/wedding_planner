import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./package.css"; // Add your CSS file for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import imgSrc from "../resourses/img.jpg";

function PackageScreen() {
  // State variables for managing plans
  const [plans, setPlans] = useState([]);
  const [caterings, setCaterings] = useState([]);
  const [musics, setMusics] = useState([]);
  const [photography, setPhotography] = useState([]);
  const [decorations, setDecorations] = useState([]);

  // State variables for managing collapsible sections
  const [hallCollapsed, setHallCollapsed] = useState(false);
  const [cateringCollapsed, setCateringCollapsed] = useState(false);
  const [decorationCollapsed, setDecorationCollapsed] = useState(false);
  const [musicCollapsed, setMusicCollapsed] = useState(false);
  const [photographyCollapsed, setPhotographyCollapsed] = useState(false);

  const [packageName, setPackageName] = useState("");
  const [isPackageCreated, setIsPackageCreated] = useState(false);

  useEffect(() => {
    // Fetch plans for each service type
    axios
      .get("http://localhost:7777/plans/service/hall")
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Hall plans:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/catering")
      .then((response) => {
        setCaterings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Catering plans:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/music")
      .then((response) => {
        setMusics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Music plans:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/photography")
      .then((response) => {
        setPhotography(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Photography plans:", error);
      });

    axios
      .get("http://localhost:7777/plans/service/decoration")
      .then((response) => {
        setDecorations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Decoration plans:", error);
      });
  }, []);

  const handleCreatePackage = () => {
    axios
      .post("/api/packages", { packagename: packageName })
      .then((response) => {
        setIsPackageCreated(true);
        console.log("Package created:", response.data);
      })
      .catch((error) => {
        console.error("Error creating package:", error);
      });
  };

  const handleDeletePackage = () => {
    // Assuming you have a state or variable containing the package ID
    const packageId = ""; // Set the package ID here

    axios
      .delete(`/api/packages/${packageId}`)
      .then((response) => {
        setIsPackageCreated(false);
        console.log("Package deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting package:", error);
      });
  };

  return (
    <div>
      <div className="heading">
        <h1> Create Package</h1>
      </div>
      <table className="event-plan" border={1}>
  <thead>
    <tr>
      <th>Type</th>
      <th>Name</th>
      <th>Price</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {[
      {
        service_type: "Hall",
        title: "Standard Package",
        price: "3000.00",
        status: "Available",
        plan_id: 1
      },
      {
        service_type: "Catering",
        title: "Premium Package",
        price: "5000.00",
        status: "Available",
        plan_id: 2
      },
      // Add more plan objects for other service types if needed
    ].map((plan) => (
      <tr key={plan.plan_id}>
        <th className="sub-heading">{plan.service_type}</th>
        <td>{plan.title}</td>
        <td>{plan.price}</td>
        <td>{plan.status}</td>
        <td>{/* Render action buttons here */}</td>
      </tr>
    ))}
    {/* Add button for sections with no plans */}
    <tr>
      <th className="sub-heading">Decoration</th>
      <td colSpan={4}>
        <button>Add Decoration Plan</button>
      </td>
    </tr>
    <tr>
      <th className="sub-heading">Music</th>
      <td colSpan={4}>
        <button>Add Music Plan</button>
      </td>
    </tr>
    <tr>
      <th className="sub-heading">Photgraphy</th>
      <td colSpan={4}>
        <button>Add Photography Plan</button>
      </td>
    </tr>
    {/* Add more buttons for other sections if needed */}
  </tbody>
</table>


      {/* Collapsible section for Hall */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setHallCollapsed(!hallCollapsed)}>
          <h2>Hall</h2>
          {hallCollapsed ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        {!hallCollapsed && (
          <div className="hal-container">
            {plans.map((plan) => (
              <div className="plan" key={plan.plan_id}>
                <img src={imgSrc} className="planimage" />
                <div className="hall-details">
                  <h3>{plan.title}</h3>
                  <h4>{plan.description}</h4>
                  <h4>Price: {plan.price}</h4>
                  {/* Add button to add the plan to the package */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible section for Catering */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setCateringCollapsed(!cateringCollapsed)}>
          <h2>Catering</h2>
          {cateringCollapsed ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        {!cateringCollapsed && (
          <div className="hal-container">
            {caterings.map((catering) => (
              <div className="plan" key={catering.plan_id}>
                <img src={imgSrc} className="planimage" />
                <div className="hall-details">
                  <h3>{catering.title}</h3>
                  <h4>{catering.description}</h4>
                  <h4>Price: {catering.price}</h4>
                  {/* Add button to add the plan to the package */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible section for Decoration */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setDecorationCollapsed(!decorationCollapsed)}>
          <h2>Decoration</h2>
          {decorationCollapsed ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        {!decorationCollapsed && (
          <div className="hal-container">
            {decorations.map((decoration) => (
              <div className="plan" key={decoration.plan_id}>
                <img src={imgSrc} className="planimage" />
                <div className="hall-details">
                  <h3>{decoration.title}</h3>
                  <h4>{decoration.description}</h4>
                  <h4>Price: {decoration.price}</h4>
                  {/* Add button to add the plan to the package */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible section for Music */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setMusicCollapsed(!musicCollapsed)}>
          <h2>Music</h2>
          {musicCollapsed ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        {!musicCollapsed && (
          <div className="hal-container">
            {musics.map((music) => (
              <div className="plan" key={music.plan_id}>
                <img src={imgSrc} className="planimage" />
                <div className="hall-details">
                  <h3>{music.title}</h3>
                  <h4>{music.description}</h4>
                  <h4>Price: {music.price}</h4>
                  {/* Add button to add the plan to the package */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collapsible section for Photography */}
      <div className="collapsible-section">
        <div
          className="collapsible-header"
          onClick={() => setPhotographyCollapsed(!photographyCollapsed)}>
          <h2>Photography</h2>
          {photographyCollapsed ? <FaArrowDown /> : <FaArrowUp />}
        </div>
        {!photographyCollapsed && (
          <div className="hal-container">
            {photography.map((photo) => (
              <div className="plan" key={photo.plan_id}>
                <img src={imgSrc} className="planimage" />
                <div className="hall-details">
                  <h3>{photo.title}</h3>
                  <h4>{photo.description}</h4>
                  <h4>Price: {photo.price}</h4>
                  {/* Add button to add the plan to the package */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PackageScreen;
