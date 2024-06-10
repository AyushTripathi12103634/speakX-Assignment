import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tweet = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tweet_id = queryParams.get('tweet');
  const [tweets, settweets] = useState([]);
  const navigate = useNavigate();
  const fetchtweets = async() => {
    try {
      const response = await axios.get(`/tweet/tweet/${tweet_id}`,{
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      settweets([response.data.tweet]);
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
  useEffect(()=>{
    fetchtweets();
  },[])

  const [comment,setcomment] = useState();

  const addcomment = async(id) => {
    try {
      const response = await axios.post(`/tweet/comment-tweet/${id}`,{comment},{
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
    {tweets && tweets.map((tweet)=>{
      console.log(tweets,tweet)
      return (<>
        <div key={tweet._id} className="card" style={{width: "38rem"}}>
          {tweet.file && tweet.file.endsWith('.jpg') && <img src={`http://localhost:5000/tweets/${tweet._id}.jpg`} className="card-img-top" alt="Tweet" />}
          {tweet.file && tweet.file.endsWith('.mp4') && <video src={`http://localhost:5000/tweets/${tweet._id}.mp4`} className="card-img-top" controls />}
          <div className="card-body">
            <h5 className="card-title" onClick={()=>navigate("/user/search?user="+tweet.author.username)}>{tweet.author.username}</h5>
            <h6 className='card-subtitle'>{tweet.author.name}</h6>
            <p className="card-text">{tweet.content}</p>
            <hr></hr>
            <div className='d-flex me-2'>  
              <input className='form-control mb-2' type='text' placeholder='Enter Comment' onChange={(e)=>setcomment(e.target.value)}></input>
              <button className='btn btn-primary' onClick={(e)=>{e.preventDefault();addcomment(tweet._id)}}>Comment</button>
            </div>
            <h6>Comments</h6>
            {tweet.comments && tweet.comments.map((comment)=>{
              return (
                  <>
                    <p key={comment._id}>{comment.comment_by.username} : {comment.comment}</p>
                  </>
                )
            })}
          </div>
        </div>
      </>)
    })}
    </>
  )
}

export default Tweet