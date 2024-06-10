import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcLike, FcDislike } from "react-icons/fc";
const Tweets = () => {
  const [tweets, settweets] = useState([]);
  const [filter,setfilter] = useState(false);
  const navigate = useNavigate();
  const fetchtweets = async() => {
    try{
      if(!filter){
        const response = await axios.get("/tweet/tweets",{
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        settweets(response.data.tweets);
      }
      else{
        const response = await axios.get("/tweet/following-tweet",{
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        settweets(response.data.tweets);
      }
    }
    catch(error){
      toast.error(`${error.response.data.message}`, {
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
    }
  }
  useEffect(() => {
    fetchtweets();
  },[filter]);

  const likeunlike = async(id) => {
    try {
      const response = await axios.patch(`/tweet/like-tweet/${id}`,{},{
        headers:{
          Authorization: localStorage.getItem("token")
        }
      })
      toast.success(`${response.data.message}`, {
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
      fetchtweets();
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
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
    }
  }

  return (
    <>
    <button className='btn btn-primary' onClick={()=>setfilter(!filter)}>{filter?"Turn filter on":"Turn filter off"}</button>
    {tweets && tweets.map((tweet)=>{
      return (<>
        <div key={tweet._id} className="card" style={{width: "18rem"}}>
          {tweet.file && tweet.file.endsWith('.jpg') && <img src={`http://localhost:5000/tweets/${tweet._id}.jpg`} className="card-img-top" alt="Tweet" />}
          {tweet.file && tweet.file.endsWith('.mp4') && <video src={`http://localhost:5000/tweets/${tweet._id}.mp4`} className="card-img-top" controls />}
          <div className="card-body">
            <h5 className="card-title" onClick={()=>navigate("/user/search?user="+tweet.author.username)}>{tweet.author.username}</h5>
            <h6 className='card-subtitle'>{tweet.author.name}</h6>
            <p className="card-text">{tweet.content}</p>
            <p className="card-text">{tweet.likes}</p>
            <span className='me-4' onClick={()=>likeunlike(tweet._id)}>{tweet.liked_by.includes(localStorage.getItem("id"))?<FcDislike />:<FcLike />}</span>
            <a href={`/user/tweet?tweet=${tweet._id}`} className="btn btn-primary">Go to tweet</a>
          </div>
        </div>
      </>)
    })}
    </>
  )
}

export default Tweets
