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
      registeredUsers
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
      registeredUsers: registeredUsers || [],
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
      return next(new HttpError(404, "Event not found"));
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      totalSeats,
      remainingSeats,
      createdBy,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(id).populate("registeredUsers");

    if (!event) {
      return next(new HttpError(404, "Event not found."));
    }

    if (remainingSeats > totalSeats) {
      return next(
        new HttpError(400, "Remaining seats cannot exceed total seats.")
      );
    }

    if (event.registeredUsers.length > totalSeats) {
      return next(
        new HttpError(
          400,
          "Total seats cannot be less than the number of registered users."
        )
      );
    }

    if (event.registeredUsers.length > remainingSeats) {
      return next(
        new HttpError(
          400,
          "Remaining seats cannot be less than the number of registered users."
        )
      );
    }

    event.title = title;
    event.description = description;
    event.location = location;
    event.totalSeats = totalSeats;
    event.remainingSeats = remainingSeats;
    event.createdBy = createdBy;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(id);

    if (!event) {
      return next(new HttpError(404, "Event not found."));
    }

    await Event.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const findRegisteredUsers = async (req, res, next) => {
  try { 
    const id = req.body.id;
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const search = req.body.search;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(id).populate({
      path: "registeredUsers",
      match: search ? { $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ]} : {},
      options: {
        limit: pageSize,
        skip: skip
      },
      select: "firstName lastName phone"
    });

    if (!event) {
      return next(new HttpError(404, "Event not found"));
    }

    const total = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$registeredUsers" },
      { $lookup: {
        from: "users",
        localField: "registeredUsers",
        foreignField: "_id",
        as: "registeredUsers"
      }},
      { $unwind: "$registeredUsers" },
      { $match: search ? { $or: [
        { "registeredUsers.firstName": { $regex: search, $options: "i" } },
        { "registeredUsers.lastName": { $regex: search, $options: "i" } },
        { "registeredUsers.phone": { $regex: search, $options: "i" } }
      ]} : {}},
      { $count: "total" }
    ]);

    res.status(200).json({
      success: true,
      data: event.registeredUsers,
      pagination: {
        total: total[0] ? total[0].total : 0,
        page,
        pages: Math.ceil((total[0] ? total[0].total : 0) / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

export { create, findAll, findOne, update, remove, findRegisteredUsers };
