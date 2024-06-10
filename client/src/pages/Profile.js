import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [profile, setProfile] = useState(null); // Initialize as null to check for loading state
  const [changeProfile, setChangeProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changePicture, setChangePicture] = useState(false);

  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [name, setName] = useState("");
  const [file, setFile] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/tweet/get-user/${username}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });
      localStorage.setItem("username",response.data.users[0].username)
      setProfile(response.data.users[0]);
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
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'http://localhost:5000/profiles/default.png';
  };

  const updateProfile = async () => {
    try {
      const response = await axios.post(`/profile/update-profile`, { name, username }, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      
      fetchProfile();
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
  };

  const updatePassword = async () => {
    try {
      const response = await axios.post("/profile/update-password", { newPassword, oldPassword }, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      fetchProfile();
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
  };

  const updatePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("/profile/upload", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProfile();
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
  };

  return (
    <>
      {profile ? (
        <div className="card" style={{ width: '30rem' }}>
          <img src={`http://localhost:5000/profiles/${localStorage.getItem("id")}.jpg`} onError={handleError} className="card-img-top" alt="..." />
          <div className="card-body">
            <h4 className="card-title">Username: {profile.username}</h4>
            <h5 className="card-subtitle">Name: {profile.name}</h5>
            <p className="card-text">Followers: {profile.followers_count}</p>
            <p className="card-text">Following: {profile.following_count}</p>
            <div className='d-flex'>
              <button className="btn btn-primary me-3" onClick={() => setChangeProfile(!changeProfile)}>Update Profile</button>
              <button className="btn btn-primary me-3" onClick={() => setChangePassword(!changePassword)}>Update Password</button>
              <button className="btn btn-primary" onClick={() => setChangePicture(!changePicture)}>Update Picture</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {changeProfile && (
        <div style={{ zIndex: "5", border: "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <dialog open style={{ border: "none", backgroundColor: '#fff', padding: '10px' }}>
            <form>
              <input className='form-control mb-3' placeholder='Enter Username' onChange={(e) => setUsername(e.target.value)}></input>
              <input className='form-control mb-3' placeholder='Enter Name' onChange={(e) => setName(e.target.value)}></input>
              <button className='btn btn-primary mx-3 my-2' onClick={(e) => { e.preventDefault(); updateProfile() }}>Submit</button>
              <button className='btn btn-primary' type="button" onClick={() => setChangeProfile(!profile)}>Close</button>
            </form>
          </dialog>
        </div>
      )}

      {changePassword && (
        <div style={{ zIndex: "5", border: "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <dialog open style={{ border: "none", backgroundColor: '#fff', padding: '10px' }}>
            <form>
              <input className='form-control mb-3' placeholder='Enter Old Password' onChange={(e) => setOldPassword(e.target.value)}></input>
              <input className='form-control mb-3' placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)}></input>
              <button className='btn btn-primary mx-3 my-2' onClick={(e) => { e.preventDefault(); updatePassword() }}>Submit</button>
              <button className='btn btn-primary' type="button" onClick={() => setChangePassword(!changePassword)}>Close</button>
            </form>
          </dialog>
        </div>
      )}

      {changePicture && (
        <div style={{ zIndex: "5", border: "none", position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <dialog open style={{ border: "none", backgroundColor: '#fff', padding: '10px' }}>
            <form>
              <input className='form-control mb-3' type='file' onChange={(e) => setFile(e.target.files[0])}></input>
              <button className='btn btn-primary mx-3 my-2' onClick={(e) => { e.preventDefault(); updatePicture() }}>Submit</button>
              <button className='btn btn-primary' type="button" onClick={() => setChangePicture(!changePicture)}>Close</button>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
};

export default Profile;
