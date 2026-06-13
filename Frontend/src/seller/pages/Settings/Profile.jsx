import React, { useEffect, useState } from "react";
import {
  getSellerProfile,
  updateSellerProfile,
  deleteSellerProfile,
} from "./api/sellerApi";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    storeName: "",
    gstNumber: "",
    governmentIdType: "",
    governmentIdNumber: "",
    bankAccountHolderName: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });

  const [editing, setEditing] = useState(false);

  // LOAD PROFILE
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getSellerProfile();
      setProfile(data);

      if (data) {
        setForm({
          storeName: data.storeName || "",
          gstNumber: data.gstNumber || "",
          governmentIdType: data.governmentIdType || "",
          governmentIdNumber: data.governmentIdNumber || "",
          bankAccountHolderName: data.bankAccountHolderName || "",
          bankAccountNumber: data.bankAccountNumber || "",
          ifscCode: data.ifscCode || "",
          bankName: data.bankName || "",
          upiId: data.upiId || "",
        });
      }
    } catch (err) {
      console.log(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSellerProfile(form);
      setEditing(false);
      loadProfile();
    } catch (err) {
      alert(err?.response?.data?.message || "Error updating profile");
    }
  };

  // DELETE PROFILE
  const handleDelete = async () => {
    if (!window.confirm("Delete seller profile?")) return;

    try {
      await deleteSellerProfile();
      setProfile(null);
      setForm({});
    } catch (err) {
      alert("Error deleting profile");
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Seller Profile</h2>

      {!profile || editing ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            name="storeName"
            placeholder="Store Name *"
            value={form.storeName}
            onChange={handleChange}
            required
          />

          <input
            name="gstNumber"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={handleChange}
          />

          <select
            name="governmentIdType"
            value={form.governmentIdType}
            onChange={handleChange}
          >
            <option value="">Select ID Type</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN</option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>

          <input
            name="governmentIdNumber"
            placeholder="Government ID Number"
            value={form.governmentIdNumber}
            onChange={handleChange}
          />

          <input
            name="bankAccountHolderName"
            placeholder="Account Holder Name"
            value={form.bankAccountHolderName}
            onChange={handleChange}
          />

          <input
            name="bankAccountNumber"
            placeholder="Bank Account Number"
            value={form.bankAccountNumber}
            onChange={handleChange}
          />

          <input
            name="ifscCode"
            placeholder="IFSC Code"
            value={form.ifscCode}
            onChange={handleChange}
          />

          <input
            name="bankName"
            placeholder="Bank Name"
            value={form.bankName}
            onChange={handleChange}
          />

          <input
            name="upiId"
            placeholder="UPI ID"
            value={form.upiId}
            onChange={handleChange}
          />

          <button type="submit" className="btn primary">
            Save Profile
          </button>

          {profile && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <div className="profile-card">
          <h3>{profile.storeName}</h3>

          <p>
            <b>GST:</b> {profile.gstNumber || "N/A"}
          </p>
          <p>
            <b>ID Type:</b> {profile.governmentIdType || "N/A"}
          </p>
          <p>
            <b>ID Number:</b> {profile.governmentIdNumber || "N/A"}
          </p>
          <p>
            <b>Bank:</b> {profile.bankName || "N/A"}
          </p>
          <p>
            <b>UPI:</b> {profile.upiId || "N/A"}
          </p>

          <p className="status">Status: {profile.verificationStatus}</p>

          <div className="actions">
            <button className="btn primary" onClick={() => setEditing(true)}>
              Edit
            </button>

            <button className="btn danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
