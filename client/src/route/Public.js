import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import axios from 'axios';
import spinnerGif from '../assets/spinner.gif';
import Spinner from '../assets/Spinner.js';
import Navbar from '../component/Navbar.js';

export default function Route(){
  const [ok, setOk] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const authCheck = async () => {
      try{
        const response = await axios.get(
          `/auth/check-login`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.data.success) {
          setOk(true);
        } else {
          setOk(false);
        }
      }
      catch(error){
        setOk(false);
      }
      setIsLoading(false);
    };
    authCheck()
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <img src={spinnerGif} alt="Loading..." />
      <h1 className="text-center" style={{ fontSize: "30px" }}>
        Loading...
      </h1>
    </div>
    ); 
  }

  return ok ? <><Navbar /><Outlet /></> : <Spinner />;
}
