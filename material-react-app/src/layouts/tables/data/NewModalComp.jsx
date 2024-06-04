import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@mui/material";
import axios from "axios";

const NewModalComp = ({
  show,
  handleClose,
  onSave,
  modalData,
  modalName,
  fetchData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setShowModal(show);
  }, [show]);
  useEffect(() => {
    setImagePreviews(modalData?.images || []);
  }, [modalData?.images, show]);

  const handleCreate = async (formData) => {
    try {
      const response = await axios.post("https://alhazm-dashboard.onrender.com/cars", formData);

      // Check for successful response
      if (response.status !== 201) {
        throw new Error("Failed to create the car");
      } else {
        fetchData();
      }
      console.log(response.data);
      const newItem = response.data;
      // Handle the new item as needed
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await axios.put(
        `https://alhazm-dashboard.onrender.com/cars/${modalData._id}`,
        formData
      );

      // Check for successful response
      if (response.status !== 200) {
        throw new Error("Failed to create the car");
      } else {
        fetchData();
        handleClose();
      }
      console.log(response.data);
      const newItem = response.data;
      // Handle the new item as needed
    } catch (error) {
      setError(error);
    }
  };
  const handleDelete = async (formData) => {
    try {
      const response = await axios.delete(
        `https://alhazm-dashboard.onrender.com/cars/${modalData._id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to create the car");
      } else {
        fetchData();
        handleClose();

      }
      fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const handleFileChange = async (e, setFieldValue, values, index) => {
    const files = e.target.files;

    // for (let i = 0; i < files.length; i) {
    //   const file = files[i];
    const base64 = await convertToBase64(files[0]);
    let previews = [...values.images];
    previews[index] = base64;
    //  previews = [...values.images, base64];

    setImagePreviews(previews);
    setFieldValue("images", previews);
    // }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const addField = (values, setFieldValue) => {
    if (!values.images) {
      // const newImages = [...values.images, ""];
      setFieldValue("images", [""]);
      setImagePreviews([""]);
    } else {
      const newImages = [...values.images, ""];
      setFieldValue("images", newImages);
      setImagePreviews(newImages);
    }
  };
  const handleSubmit = (values) => {
    console.log(values);
  };
  const initialValues = useMemo(
    () => ({
      name: modalData ? modalData.name : "",
      desc: modalData ? modalData.desc : "",
      price: modalData ? modalData.price : "",
      images: modalData ? modalData.images : [],
    }),
    [modalData]
  );

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "blue" }}>Add New Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            modalName === "add new car"
              ? handleCreate(values)
              : handleUpdate(values);
            handleClose();
            setImagePreviews([]);
            resetForm();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <Field
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="desc" className="form-label">
                  Description
                </label>
                <Field
                  as="textarea"
                  className="form-control"
                  id="desc"
                  name="desc"
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <Field
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                />
              </div>
              <label htmlFor="images" className="form-label">
                Images
              </label>
              <div className="mb-3">
                {values?.images &&
                  values?.images.length > 0 &&
                  values?.images.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      {imagePreviews[index] && (
                        <img
                          src={imagePreviews[index]}
                          alt={`Preview ${index}`}
                          style={{ maxWidth: "100px", marginRight: "10px" }}
                        />
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <Input
                          type="file"
                          className="form-control w-50"
                          id={`image-${index}`}
                          name={`image-${index}`}
                          onChange={(e) =>
                            handleFileChange(e, setFieldValue, values, index)
                          }
                        />
                        <Button
                          variant="danger"
                          onClick={() => {
                            const newImages = [...values.images];
                            newImages.splice(index, 1);
                            setFieldValue("images", newImages);
                            setImagePreviews(
                              imagePreviews.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                <Button
                  variant="secondary"
                  onClick={() => addField(values, setFieldValue)}
                >
                  Add Image
                </Button>
              </div>
              <Modal.Footer>
                <Button variant="danger" onClick={handleDelete}>
                  delete
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default NewModalComp;
