import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { putApi } from "../utils/apis";
import Select from "react-select";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";

export default function EditTemplateModal(props: any) {
  const [reportsData, setReportsData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [templateData, setTemplateData] = useState({
    name: "",
    report: "",
    companies: [],
  });

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

  useEffect(() => {
    const data: any = {
      name: props?.data?.name,
      report: {
        value: props?.data?.report?.id,
        label: props?.data?.report?.name,
      },
      companies: props?.data?.companies?.map((company: any) => {
        return {
          value: company.id,
          label: company.name,
        };
      }),
    };
    setTemplateData(data);
  }, [props?.data]);

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
    report: Yup.object().required("Report is required"),
    companies: Yup.array().min(1).required("Name is required"),
  });

  const submitHandler = (values: any) => {
    const finalData = {
      name: values.name,
      reportId: values?.report?.value,
      companyIds: values.companies.map((company: any) => {
        return company?.value;
      }),
    };
    setIsLoading(true);
    putApi(`templates/${props?.data?.id}`, finalData)
      .then((res) => {
        setIsLoading(false);
        props?.getTemplates();
        toast.success(res?.data?.message);
        handleShow();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
        handleShow();
      });
  };
  return (
    <>
      <Modal show={props.isOpen} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={templateData}
            onSubmit={(values) => submitHandler(values)}
            validationSchema={validate}
            enableReinitialize={true}
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
                      defaultValue={values.name}
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
                      value={values?.report}
                      className={
                        errors.name
                          ? "custom-form-control form-error-border"
                          : "custom-form-control"
                      }
                      onChange={(selectedOptions: any) => {
                        setFieldValue("report", selectedOptions);
                      }}
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
                      value={values?.companies}
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
                      "Save Changes"
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
