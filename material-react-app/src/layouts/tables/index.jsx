import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import React, { useEffect, useMemo, useState } from "react";
import MDBadge from "components/MDBadge";
import team2 from "assets/images/team-2.jpg";
import MDAvatar from "components/MDAvatar";
import NewModalComp from "./data/NewModalComp";
import { Button, CircularProgress } from "@mui/material";
import { PlusOne } from "@mui/icons-material";
function Tables() {
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState();
  const [modalName, setModalName] = React.useState("");
  const handleEditCar = (item) => {
    setModalData(item);
    setModalName("edit car");
    setOpen(true);
  };
  const handleAddNewCar = () => {
    setModalData({});
    setModalName("add new car");
    setOpen(true);
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://alhazm-dashboard.onrender.com/cars"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      setData(result);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.example.com/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const newItem = await response.json();
      setData([...data, newItem]);
      // setFormData({ name: "", value: "" });
    } catch (error) {
      setError(error);
    }
  };
  const handleUpdate = async (id) => {
    const updatedItem = prompt("Enter new value:");
    if (!updatedItem) return;
    try {
      const response = await fetch(`https://api.example.com/data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: updatedItem }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedData = await response.json();
      setData(data.map((item) => (item.id === id ? updatedData : item)));
    } catch (error) {
      setError(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://api.example.com/data/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  const handleClose = (data) => {
    setOpen(false);
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="md" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography
        display="block"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
  const columns = [
    { Header: "name", accessor: "name", width: "45%", align: "left" },
    { Header: "description", accessor: "description", align: "left" },
    // { Header: "status", accessor: "status", align: "center" },
    { Header: "price", accessor: "price", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = useMemo(() => {
    return data?.length > 0
      ? data?.map((item, index) => ({
          name: <Author image={item.images[0]} name={item.name} email="" />,
          description: <Job title={item.desc} description={""} />,
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent="online"
                color="success"
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          price: (
            <MDTypography
              component="a"
              href="#"
              variant="caption"
              color="text"
              fontWeight="medium"
            >
              {item.price}
            </MDTypography>
          ),
          action: (
            <div
            className="btn btn-outline-warning"
              // component="a"
              // href="#"
              // variant="caption"
              // color="text"
              // fontWeight="medium"
              onClick={() => handleEditCar(item)} // Call handleOpen with data
            >
              Edit
            </div>
          ),
        }))
      : [];
  }, [data, handleEditCar]);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    <div
                      // color="warning"
                      className="btn  btn-warning"
                      // size="small"
                      // variant="outlined"
                      onClick={handleAddNewCar}
                    >
                      Add New
                    </div>
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  {!data ? (
                    <div className=" d-flex justify-content-center">
                      <CircularProgress />

                    </div>
                  ) : (
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
      <NewModalComp
        show={open}
        handleClose={handleClose}
        modalData={modalData}
        modalName={modalName}
        fetchData={fetchData}
      />
    </>
  );
}

export default Tables;
