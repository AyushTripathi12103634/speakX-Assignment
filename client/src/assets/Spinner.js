import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import spinnerGif from './spinner.gif';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const naviagte = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    if (count === 0){
      toast.info(`User not logged in!!!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      naviagte(`/${path}`, {
        state: location.pathname,
      });
    }
    return () => {
      clearInterval(interval);
    };
  }, [count, naviagte, location,path]);

  return (
      <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img src={spinnerGif} alt="Loading..." />
      <h1 className="text-center" style={{ fontSize: "30px" }}>
        Redirecting to you in {count} seconds
      </h1>
    </div>
  );
};

export default Spinner;
