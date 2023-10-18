import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

// update Doctor
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to update",
    });
  }
};

// delete Doctor
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

// getSingle Doctor
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: doctor,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

// getAll Doctor
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      // Search based on doctor name or specialization
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } }, // Case-insensitive regex search on the name field
          { specialization: { $regex: query, $options: "i" } }, // Case-insensitive regex search on the specialization field
        ],
      }).select("-password");
    } else {
      // Get all approved doctors
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "Successful",
      data: doctors,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getDoctorProfile = async (req, res) => {
  const userId = req.userId;

  try {
    // let user = null;
    const user = await Doctor.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const appointments = await Booking.find({ doctor: userId });

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Successfully ",
      data: { ...rest, appointments },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong! cannot get!" });
  }
};

// Define the controller function to fetch all doctors
export const getAllDoctors = async (req, res) => {
  try {
    // Use the find method to retrieve all doctors
    const doctors = await Doctor.find();

    return res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Define the controller function to update the status
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Get the doctor ID from the request parameters

    // Check if the doctor with the given ID exists
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update the doctor's status to "approved"
    doctor.isApproved = "approved";

    // Save the updated doctor document
    await doctor.save();

    return res.status(200).json({ message: 'Doctor status updated to approved' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUnapprovedDoctors = async () => {
  const unapprovedDoctors = await Doctor.find({
    isApproved: "pending",
    // createdAt: { $lte: new Date(Date.now() - timeThreshold) },
  });

  for (const doctor of unapprovedDoctors) {
    // Delete the unapproved doctor
    await Doctor.findByIdAndDelete(doctor._id);
  }
};
