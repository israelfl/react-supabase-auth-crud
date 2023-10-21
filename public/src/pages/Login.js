import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase/client";
import { getUserData } from "../services";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signInWithOtp({
        email: email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData()
      .then((result) => {
        if (result) navigate("/");
      })
      .catch((error) => console.error(error));
  }, [navigate]);

  return (
    <div className="row mt-4">
      <div className="col-md-4 offset-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <input
            type="email"
            name="email"
            placeholder="youremail@site.com"
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-2"
          />
          <button className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
