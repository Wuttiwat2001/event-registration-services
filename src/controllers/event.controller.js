import Event from "../models/event.model.js";
import mongoose from "mongoose";

const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      totalSeats,
      remainingSeats,
      createdBy,
    } = req.body;

    if (remainingSeats > totalSeats) {
      return next(
        new HttpError(400, "Remaining seats cannot exceed total seats.")
      );
    }

    const event = new Event({
      title,
      description,
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
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.body.search;
    const availableSeats = req.body.availableSeats;
    const createdAtDate = req.body.createdAtDate;
    const updatedAtDate = req.body.updatedAtDate;

    const query = {};

    if (availableSeats) {
      if (availableSeats === "full") {
        query.remainingSeats = 0;
      } else if (availableSeats === "available") {
        query.remainingSeats = { $gt: 0 };
      }
    }

    if (createdAtDate.length > 0) {
      const createdAtStart = new Date(createdAtDate[0]);
      createdAtStart.setHours(0, 0, 0, 0);
      const createdAtEnd = new Date(createdAtDate[1]);
      createdAtEnd.setHours(23, 59, 59, 999);
      query.createdAt = {
        $gte: createdAtStart,
        $lt: createdAtEnd,
      };
    }

    if (updatedAtDate.length > 0) {
      const updatedAtStart = new Date(updatedAtDate[0]);
      updatedAtStart.setHours(0, 0, 0, 0);
      const updatedAtEnd = new Date(updatedAtDate[1]);
      updatedAtEnd.setHours(23, 59, 59, 999);
      query.updatedAt = {
        $gte: updatedAtStart,
        $lt: updatedAtEnd,
      };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip);

    const total = await Event.countDocuments(query);

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

const findOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(id).populate(
      "createdBy",
      "firstName lastName"
    );
    if (!event) {
      return next(new HttpError(400, "Event not found"));
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      totalSeats,
      remainingSeats,
    } = req.body;


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
