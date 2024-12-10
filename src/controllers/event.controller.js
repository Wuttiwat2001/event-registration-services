import Event from "../models/event.model.js";

const create = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      totalSeats,
      remainingSeats,
      createdBy,
    } = req.body;

    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    if (remainingSeats > totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Remaining seats cannot exceed total seats.",
      });
    }

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      totalSeats,
      remainingSeats: remainingSeats || totalSeats,
      createdBy,
    });

    const savedEvent = await event.save();

    res
      .status(201)
      .json({
        success: true,
        data: savedEvent,
        message: "Event created successfully.",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const findAll = async (req, res) => {};

const findOne = async (req, res) => {};

const update = async (req, res) => {};

const remove = async (req, res) => {};

export { create, findAll, findOne, update, remove };
