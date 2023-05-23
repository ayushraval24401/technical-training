import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../assets/css/auth.css";
import { postApi } from "../utils/apis";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Login() {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const validate = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });

  const submitHandler = (values: any) => {
    setIsLoading(true);
    postApi("auth/login", values)
      .then((res) => {
        toast.success(res?.data?.message);
        setIsLoading(false);
        localStorage.setItem("userAccessToken", res?.data?.data?.token);
        localStorage.setItem("username", res?.data?.data?.username);
        ctx.setIsAuthenticated(true);
        ctx.setUsername(res?.data?.data?.username);
        navigate("/");
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div className="login_container">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => submitHandler(values)}
        validationSchema={validate}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
            <form onSubmit={handleSubmit} className="login_form">
              <h4 className="mb-3">Login</h4>
              <div className="mb-3">
                <input
                  type="email"
                  className={
                    errors.email
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email && (
                  <p className="form-error">{errors.email}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    errors.password
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>
              <button type="submit" className="btn form_buttons mb-3">
                {isLoading ? (
                  <RotatingLines
                    strokeColor="#fff"
                    strokeWidth="4"
                    animationDuration="0.75"
                    width="28"
                    visible={true}
                  />
                ) : (
                  "Login"
                )}
              </button>

              <p className="mb-2">
                Don't have an account? <Link to="/signup">SignUp</Link>
              </p>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
