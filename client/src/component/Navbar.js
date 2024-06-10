import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  const searchuser = (e) => {
    navigate(`/user/search?user=${search}`);
  }
  return (
    <>
    <div className='d-flex justify-content-around mt-3'>
        <div className='d-flex'>
            <img className='mt-3 w-25 h-25' src='https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg' alt='' />
            <h1>Twitter</h1>
        </div>
        <div>
            <div className='d-flex'>
                <input className='form-control mx-2' type='text' placeholder='Usename or Name' onChange={(e)=>{setsearch(e.target.value)}}></input>
                <button className='btn btn-primary' onClick={searchuser}>Search</button>
            </div>
        </div>
        <div>
            <div>
                <button className='btn btn-primary mx-3' onClick={()=>navigate("/user")}>Home</button>
                <button className='btn btn-primary mx-3' onClick={()=>navigate("/user/profile")}>Profile</button>
                <button className='btn btn-primary mx-3' onClick={()=>navigate(`/user/user-tweet?user=${localStorage.getItem("id")}`)}>Tweets</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Navbar