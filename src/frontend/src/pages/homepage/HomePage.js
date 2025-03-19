import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userService";
import Header from "components/header/Header";

const HomePage = () => {
  const [user, setLocalUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await userAPI.getProfile();
        setLocalUser(userData);
        dispatch(setUser(userData));
      } catch (err) {
        setLocalUser(null);
        dispatch(clearUser());
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleLogout = async () => {
    setLocalUser(null);
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>
            Name: {user.firstName} {user.lastName}
          </p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

export default HomePage;
