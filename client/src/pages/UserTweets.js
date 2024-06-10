import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserTweets = () => {
  const [UserTweets, setUserTweets] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get('user');
  const author = localStorage.getItem("id") === user;
  const fetchUserTweets = async () => {
    try {
      const response = await axios.get(`/tweet/user-tweet/${user}`,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );
      setUserTweets(response.data.tweets);
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
  useEffect(() => {
    fetchUserTweets();
  }, [])

  const [edit, setedit] = useState(false);
  const deletetweet = async (id) => {
    try {
      const response = await axios.delete(`/tweet/delete-tweet/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      toast.error(`${response.data.message}`, {
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

  const [content, setcontent] = useState();
  const [file, setfile] = useState();
  const edittweet = async (id) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('file', file);

      const token = localStorage.getItem('token');

      const response = await axios.post(`/tweet/update-tweet/${id}`, formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

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
      fetchUserTweets();
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

  const [create,setcreate] = useState(false);
  const [tweetcontent, settweetcontent] = useState("");
  const [tweetfile, settweetfile] = useState();

  const createtweet = async() => {
    try {
      const formData = new FormData();
      formData.append('content', tweetcontent);
      formData.append('file', tweetfile);
      const response = await axios.post(`/tweet/create-tweet`,formData,{
        headers: {
          Authorization: localStorage.getItem("token"),
          'Content-Type': 'multipart/form-data'
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
      <button className='btn btn-primary mb-5' onClick={()=>setcreate(!create)}>Create Tweet</button>
      {create && (
        <>
          <div style={{ zIndex:"5",border: "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <dialog open style={{ border: "none", backgroundColor: '#fff', padding: '10px' }}>
              <form>
                <input placeholder='Content' className='form-control my-2' type="text" onChange={(e) => settweetcontent(e.target.value)} />
                <input className='form-control my-2' type="file" onChange={(e) => settweetfile(e.target.files[0])} />
                <button className='btn btn-primary mx-3 my-2' onClick={(e) => { e.preventDefault(); createtweet() }}>Submit</button>
                <button className='btn btn-primary' type="button" onClick={() => setcreate(!create)}>Close</button>
              </form>
            </dialog>
          </div>
        </>
      )}
      {UserTweets && UserTweets.map((tweet) => {
        return (<>
          <div key={tweet._id} className="card" style={{ width: "25rem" }}>
            {tweet.file && tweet.file.endsWith('.jpg') && <img src={`http://localhost:5000/tweets/${tweet._id}.jpg`} className="card-img-top" alt="Tweet" />}
            {tweet.file && tweet.file.endsWith('.mp4') && <video src={`http://localhost:5000/tweets/${tweet._id}.mp4`} className="card-img-top" controls />}
            <div className="card-body">
              <h5 className="card-title" onClick={() => navigate("/user/search?user=" + tweet.author.username)}>{tweet.author.username}</h5>
              <h6 className='card-subtitle'>{tweet.author.name}</h6>
              <p className="card-text">{tweet.content}</p>
              <a href={`/user/tweet?tweet=${tweet._id}`} className="btn btn-primary">Go to tweet</a>
              {author && (
                <>
                  <button className='ms-2 btn btn-primary' onClick={() => setedit(!edit)}>Edit Tweet</button>
                  <button className='ms-2 btn btn-danger' onClick={() => deletetweet(tweet._id)}>Delete Tweet</button>
                </>
              )}
              {edit && (
                <>
                  <div style={{ border: "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <dialog open style={{ border: "none", backgroundColor: '#fff', padding: '10px' }}>
                      <form>
                        <input placeholder='Content' className='form-control my-2' type="text" onChange={(e) => setcontent(e.target.value)} />
                        <input className='form-control my-2' type="file" onChange={(e) => setfile(e.target.value)} />
                        <button className='btn btn-primary mx-3 my-2' onClick={(e) => { e.preventDefault(); edittweet(tweet._id) }}>Submit</button>
                        <button className='btn btn-primary' type="button" onClick={() => setedit(!edit)}>Close</button>
                      </form>
                    </dialog>
                  </div>
                </>
              )}
            </div>
          </div>
        </>)
      })}
    </>
  )
}

export default UserTweets