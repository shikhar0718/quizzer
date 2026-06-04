import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(

        "http://localhost:5000/login",

        formData

      );
      console.log(response.data);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data.user)
      );

      alert("Login Successful");

      navigate("/");

    }

    catch(err){

      console.log(err.response?.data);
      console.log(err);

      alert("Login Failed");

    }

  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4"
      >

        <h1 className="text-white text-3xl font-bold text-center">
          Login
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <button
          type="submit"
          className="w-full bg-white text-black p-3 rounded font-semibold"
        >
          Login
        </button>

      </form>

    </div>
  );
}