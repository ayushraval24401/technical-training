import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteApiWithData } from "../utils/apis";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

export default function DeleteTemplateModal(props: any) {
  const [templates, setTemplates] = useState([]);

  const [deleteTemplate, setDeleteTemplate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => props.setIsOpen(false);

  useEffect(() => {
    setTemplates(props?.data);
  }, [props?.data]);

  const handleChange = (e: any) => {
    setDeleteTemplate((prev: any) => {
      if (e.target.checked === true) {
        return [...prev, e.target.name];
      } else {
        return prev.filter((item: any) => item != e.target.name);
      }
    });
  };

  const submitHandler = () => {
    setIsLoading(true);
    deleteApiWithData("templates", { templates: deleteTemplate })
      .then((res) => {
        setIsLoading(false);
        toast.success(res?.data?.message);
        handleShow();
        if (res) {
          props?.getTemplates();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err?.response?.data?.message);
        handleShow();
      });
  };

  // "companyIds":["64670e23497db65b9bb6fa71","64670e58497db65b9bb6fa72",""]

  return (
    <>
      <Modal show={props.isOpen} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Delet Templates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {templates?.map((item: any) => {
            return (
              <div className="input-group mb-3">
                <div className="input-group-text">
                  <input
                    name={item?.id}
                    className="form-check-input mt-0"
                    type="checkbox"
                    aria-label="Checkbox for following text input"
                    onChange={handleChange}
                  />
                </div>
                <label
                  className="form-control"
                  aria-label="Text input with checkbox"
                >
                  {item?.name}
                </label>
              </div>
            );
          })}
          <Button type="submit" variant="danger" onClick={submitHandler}>
            {isLoading ? (
              <RotatingLines
                strokeColor="#fff"
                strokeWidth="4"
                animationDuration="0.75"
                width="28"
                visible={true}
              />
            ) : (
              "Delete Templates"
            )}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
