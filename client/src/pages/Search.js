import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Search() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('user');
    const navigate = useNavigate();
    const [userlist, setuserlist] = useState([]);
    const searchuser = async (e) => {
        try {
            const response = await axios.get(`/tweet/get-user/${username}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });
            setuserlist(response.data.users);
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
        }
        catch (error) {
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
        searchuser();
    }, []);

    const followunfollow = async (follow, userId) => {
        try {
            const endpoint = follow ? 'unfollow-user' : 'follow-user';
            const response = await axios.patch(`tweet/${endpoint}/${userId}`, {}, {
                headers: {
                    Authorization: localStorage.getItem("token")
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
            searchuser();
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
            {userlist && userlist.map((user) => {
                if (!user) {
                    return null; // or return some default component
                }
                return (
                    <div className="card-body" style={{ width: "18rem" }}>
                        {user.profile && <img src={`http://localhost:5000/profiles/${user._id}.jpg`} className="card-img-top" alt="Profile" />}
                        {!user.profile && <img src={`http://localhost:5000/profiles/default.png`} className="card-img-top" alt="Profile" />}
                        <h5 className="card-title">{user.username}</h5>
                        <h6 className='card-subtitle'>{user.name}</h6>
                        <p className="card-text">Following: {user.following_count}</p>
                        <p className="card-text">Followers: {user.followers_count}</p>
                        <a href={`/user/user-tweet?user=${user._id}`} className="btn btn-primary">Go to tweets</a>
                        {localStorage.getItem("username")!==user.username && <button onClick={() => followunfollow(user.follow, user._id)} className="btn btn-primary">{user.follow ? "Unfollow" : "Follow"}</button>}
                        <a href={user.profile ? `http://localhost:5000/profiles/${user._id}.jpg` : `http://localhost:5000/profiles/default.png`} className="btn btn-primary">Profile</a>
                    </div>
                )
            })}
        </>
    );

}

export default Search;
