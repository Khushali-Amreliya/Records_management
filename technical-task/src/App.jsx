import React, { useState, useEffect } from "react";
import { TbPencilMinus } from "react-icons/tb";
import { MdOutlineChevronLeft, MdChevronRight } from "react-icons/md";
import "./App.css";
import { City, State } from "country-state-city";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const App = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    city: "",
    zip: "",
  });

  const [records, setRecords] = useState([]);
  const [editDetail, setEditDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://records-management.onrender.com/v1/records/list_records");
      setRecords(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching records:", err);
      setLoading(false);
    }
  };

  const states = State.getStatesOfCountry("IN");
  const districts = form.state ? City.getCitiesOfState("IN", form.state) : []

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10)
      let formatted = digits
      if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      } else if (digits.length > 3) {
        formatted = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}`
      } else if (digits.length > 0) {
        formatted = `(${digits.slice(0, 3)}`
      }
      setForm({ ...form, phone: formatted })
    } else if (name === "state") {
      setForm({ ...form, state: value, district: "" })
    } else if (name === "zip") {
      const zipValue = value.slice(0, 6)
      setForm({ ...form, zip: zipValue })
    } else {
      setForm({ ...form, [name]: value })
    }
  };

  const validateForm = () => {
    const { firstName, lastName, phone, email, address, state, district, city, zip } = form
    if (!firstName || !lastName || !phone || !email || !address || !state || !district || !city || !zip) {
      toast.info("Please fill all required fields");
      return false;
    }
    const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal.test(email)) {
      toast.warn("Please enter a valid email address");
      return false;
    }
    const phoneVal = /^\(\d{3}\)-\d{3}-\d{4}$/;
    if (!phoneVal.test(phone)) {
      toast.warn("Please enter a valid phone number");
      return false;
    }
    if (zip.length !== 6) {
      toast.warn("ZIP code must be exactly 6 characters");
      return false;
    }
    return true;
  };

  // Record Add & Edit API
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editDetail !== null) {
        const recordEdit = records[editDetail];

        const res = await axios.put(
          `https://records-management.onrender.com/v1/records/edit_records/${recordEdit._id}`,
          form
        );

        const updatedRecords = [...records];
        updatedRecords[editDetail] = res.data.record;
        setRecords(updatedRecords);
        

        toast.success("Record updated successfully");
        setEditDetail(null);
      } else {
        const res = await axios.post("https://records-management.onrender.com/v1/records/add_records", form);
        toast.success("Record added successfully");
        setRecords([...records, res.data.record]);
      }

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        state: "",
        district: "",
        city: "",
        zip: "",
      });
    } catch (err) {
      console.error("Error saving record:", err);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      district: "",
      city: "",
      zip: "",
    });
  };

  const handleEditDetail = (index) => {
    setForm(records[index]);
    setEditDetail(index);
  };

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(8)

  // Pagination calculation
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePageSize = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-3">
      <ToastContainer autoClose={2000} position='top-left' className="custom-toast-container" />
      <section className="container-fluid main_div rounded-3">
        <div className="row">
          {/* Form */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 my-3">
            <h6 className="text-center">Add/Edit the single record Here</h6>
            <form>
              <div className="form-group floating">
                <input type="text" className="form-control" placeholder=" " name="firstName" value={form.firstName} onChange={handleChange} required />
                <label>First Name</label>
              </div>
              <div className="form-group floating">
                <input type="text" className="form-control" placeholder=" " name="lastName" value={form.lastName} onChange={handleChange} required />
                <label>Last Name</label>
              </div>
              <div className="form-group floating">
                <input type="text" className="form-control" placeholder=" " name="phone" value={form.phone} onChange={handleChange} required />
                <label>Phone (Primary)</label>
              </div>
              <div className="form-group floating">
                <input type="email" className="form-control" placeholder=" " name="email" value={form.email} onChange={handleChange} required />
                <label>Email</label>
              </div>
              <div className="form-group floating">
                <input type="text" className="form-control" placeholder=" " name="address" value={form.address} onChange={handleChange} required />
                <label>Address</label>
              </div>

              {/* State & District */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="form-group floating">
                    <select className="form-control" required value={form.state} onChange={handleChange} name="state">
                      <option value="" disabled hidden></option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <label>State</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group floating">
                    <select className="form-control" required value={form.district} onChange={handleChange} name="district" disabled={!form.state}>
                      <option value="" disabled hidden></option>
                      {districts.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    <label>District</label>
                  </div>
                </div>
              </div>

              {/* City & Zip */}
              <div className="row g-3">
                <div className="col-6">
                  <div className="form-group floating">
                    <input type="text" className="form-control" value={form.city} placeholder=" " name="city" onChange={handleChange} required />
                    <label>City</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group floating">
                    <input type="text" className="form-control" value={form.zip} onChange={handleChange} name="zip" placeholder=" " required />
                    <label>Zip Code</label>
                  </div>
                </div>
              </div>
            </form>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn_cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn_save" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="col-xl-9 col-lg-8 col-md-6 col-sm-6 col-12 my-3">
            <h6 className="text-center">Show the list of records</h6>
            {loading ? (
              <p className="text-center">Loading......</p>
            ) : (
              <div className="table-responsive table-bordered">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>FirstName</th>
                      <th>LastName</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>Zip</th>
                      <th>State</th>
                      <th>District</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((rec, index) => (
                      <tr key={indexOfFirstRecord + index}>
                        <td>
                          <button className="btn btn-sm" onClick={() => handleEditDetail(indexOfFirstRecord + index)}>
                            <TbPencilMinus />
                          </button>
                        </td>
                        <td>{rec.firstName}</td>
                        <td>{rec.lastName}</td>
                        <td>{rec.phone}</td>
                        <td>{rec.email}</td>
                        <td>{rec.address}</td>
                        <td>{rec.city}</td>
                        <td>{rec.zip}</td>
                        <td>{states.find((s) => s.isoCode === rec.state)?.name || ""}</td>
                        <td>{rec.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: "12px" }}>
              <div>
                <label className="me-2">Show</label>
                <select value={recordsPerPage} onChange={handlePageSize} className="border-none d-inline-block w-auto p-1 rounded" style={{ fontSize: "12px" }}>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="ms-2">entries per page</span>
              </div>

              <div>
                <span className="me-3">
                  {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, records.length)} of {records.length}
                </span>
                <button className="btn btn-sm btn-outline-secondary me-1" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  <MdOutlineChevronLeft />
                </button>
                <button className="btn btn-sm btn-outline-secondary ms-1" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                  <MdChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
