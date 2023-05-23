import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../assets/css/auth.css";
import { postApi } from "../utils/apis";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";

export default function Register() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const validate = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    confirm_password: Yup.string()
      .required("Confirm password required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const submitHandler = (values: any) => {
    setIsLoading(true);
    postApi("auth/register", values)
      .then((res) => {
        setIsLoading(false);
        toast.success(res?.data?.message);
        navigate("/login");
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <div className="signup_container">
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
          confirm_password: "",
        }}
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
            <form onSubmit={handleSubmit} className="signup_form">
              <h4 className="mb-3">Sign Up</h4>
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
                  type="text"
                  className={
                    errors.username
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="username"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                />
                {errors.username && touched.username && (
                  <p className="form-error">{errors.username}</p>
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
              <div className="mb-3">
                <input
                  type="password"
                  className={
                    errors.confirm_password
                      ? "form-control custom-form-control form-error-border"
                      : "form-control custom-form-control"
                  }
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={values.confirm_password}
                  onChange={handleChange}
                />
                {errors.confirm_password && touched.confirm_password && (
                  <p className="form-error">{errors.confirm_password}</p>
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
                  "Sign Up"
                )}
              </button>

              <p className="mb-2">
                Already Registered? <Link to="/login">Login</Link>
              </p>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
