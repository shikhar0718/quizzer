import { useState } from "react";
import axios  from "axios";
export default function Register() {

  const [formData, setFormData] = useState({
    name: "",
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

        const response =
        await axios.post(

            "http://localhost:5000/register",

            formData

        );

        console.log(response.data);

        alert("Registration Successful");

    }

    catch(err){

        console.log(err);

        alert("Registration Failed");

    }

};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-[400px] space-y-4"
      >

        <h1 className="text-white text-3xl font-bold text-center">
          Register
        </h1>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

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
          Register
        </button>

      </form>

    </div>
  );
}