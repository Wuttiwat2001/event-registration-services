import Event from "../models/event.model.js";
import mongoose from "mongoose";

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

    res.status(201).json({
      success: true,
      data: savedEvent,
      message: "Event created successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.query.search;

    const query = {};



    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "firstName lastName")
      .limit(pageSize)
      .skip(skip);

    const total = await Event.countDocuments({});

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findById(id).populate(
      "createdBy",
      "firstName lastName"
    );
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      totalSeats,
      remainingSeats,
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

    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    event.title = title;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;
    event.location = location;
    event.totalSeats = totalSeats;
    event.remainingSeats = remainingSeats;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { create, findAll, findOne, update, remove };
