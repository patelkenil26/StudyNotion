import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import {
  getAllInstructors,
  getInstructorDetails,
} from "../../../../services/operations/adminAPI";

import InstructorTable from "./Instructor/InstructorTable";
import InstructorModal from "./Instructor/InstructorModal";

export default function ManageInstructors() {
  const { token } = useSelector((state) => state.auth || {});
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  // for detail modal
  const [selectedInstructorDetails, setSelectedInstructorDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchInstructors = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getAllInstructors(token);
      if (res?.success) {
        setInstructors(Array.isArray(res.data) ? res.data : []);
      } else {
        toast.error(res?.message || "Failed to fetch instructors");
      }
    } catch (err) {
      console.error("fetchInstructors error:", err);
      toast.error("Something went wrong while loading instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    if (!token) return;
    setDetailLoading(true);
    try {
      const res = await getInstructorDetails(id, token);
      if (res?.success) {
        setSelectedInstructorDetails(res.data || null);
      } else {
        toast.error(res?.message || "Failed to load instructor details");
      }
    } catch (err) {
      console.error("getInstructorDetails error:", err);
      toast.error("Error fetching instructor details");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedInstructorDetails(null);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Manage Instructors</h1>

      <InstructorTable
        instructors={instructors}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {selectedInstructorDetails && (
        <InstructorModal
          details={selectedInstructorDetails}
          loading={detailLoading}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
