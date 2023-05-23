import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { postApi } from "../utils/apis";
import Select from "react-select";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";

export default function AddTemplateModal(props: any) {
  const [reportsData, setReportsData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => props.setIsOpen(false);

  useEffect(() => {
    const data = props?.reportsData?.map((item: any) => {
      return { value: item.id, label: item.name };
    });
    setReportsData(data);
  }, [props?.reportsData]);

  useEffect(() => {
    const data = props?.companyData?.map((item: any) => {
      return { value: item.id, label: item.name };
    });
    setCompanyData(data);
  }, [props?.companyData]);

  const submitHandler = (values: any) => {
    const companies = values?.companies?.map((item: any) => {
      return item?.value;
    });

    const data = { ...values, companies };
    setIsLoading(true);
    postApi("templates", data)
      .then((res) => {
        setIsLoading(false);
        toast.success(res?.data?.message);
        props?.getTemplates();
        handleShow();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
        handleShow();
      });
  };

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
    report: Yup.string().required("Report is required"),
    companies: Yup.array().min(1).required("Name is required"),
  });

  return (
    <>
      <Modal show={props.isOpen} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Add Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ name: "", report: "", companies: [] }}
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
                <form onSubmit={handleSubmit} className="px-5">
                  <div className="mb-3">
                    <input
                      type="name"
                      className={
                        errors.name
                          ? "form-control custom-form-control form-error-border"
                          : "form-control custom-form-control"
                      }
                      name="name"
                      placeholder="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="form-error">{errors.name}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <Select
                      options={reportsData}
                      name="report"
                      className={
                        errors.name
                          ? "custom-form-control form-error-border"
                          : "custom-form-control"
                      }
                      onChange={(selectedOptions: any) =>
                        setFieldValue("report", selectedOptions.value)
                      }
                    />

                    {errors.report && touched.report && (
                      <p className="form-error">{errors.report}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <Select
                      options={companyData}
                      name="report"
                      isMulti
                      className={
                        errors.name
                          ? "custom-form-control form-error-border"
                          : "custom-form-control"
                      }
                      onChange={(selectedOptions: any) => {
                        setFieldValue("companies", selectedOptions);
                      }}
                    />{" "}
                    {errors.companies && touched.companies && (
                      <p className="form-error">{errors.companies}</p>
                    )}
                  </div>

                  <Button type="submit" variant="primary">
                    {isLoading ? (
                      <RotatingLines
                        strokeColor="#fff"
                        strokeWidth="4"
                        animationDuration="0.75"
                        width="28"
                        visible={true}
                      />
                    ) : (
                      "Add Template"
                    )}
                  </Button>
                </form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}
