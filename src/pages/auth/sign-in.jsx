import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/sign-in") {
      localStorage.removeItem('token');
    }
  }, [location.pathname]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        email,
        password
      });      
      if (response.status === 200) {
        const userData = response.data.data;
        // localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.authToken);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-2">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className=" font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-10 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        {error && <div className="text-red-600">{error}</div>}
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing In.." : "Sign In"}
          </Button>
          {/* <Link to="/dashboard/home" className="mt-6"><Button className="mt-6" fullWidth>
            Sign In
          </Button></Link> */}

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
        </form>
      </div>
      <div className="w-2/6 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>

    </section>
  );
}

export default SignIn;
