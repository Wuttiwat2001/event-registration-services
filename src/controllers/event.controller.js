import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import HttpError from "../utils/HttpError.js";

const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      totalSeats,
      remainingSeats,
      createdBy,
      registeredUsers,
    } = req.body;

    const user = await User.findById(createdBy);
    if (!user) {
      return next(new HttpError(400, "Creator not found."));
    }

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
    const search = req.body.search || "";
    const availableSeats = req.body.availableSeats || "";
    const createdAtDate = req.body.createdAtDate || [];
    const updatedAtDate = req.body.updatedAtDate || [];

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
        { "createdBy.firstName": { $regex: search, $options: "i" } },
        { "createdBy.lastName": { $regex: search, $options: "i" } },
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
    const { title, description, location, totalSeats, remainingSeats } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(id).populate("registeredUsers");

    if (!event) {
      return next(new HttpError(404, "Event not found."));
    }

    const totalRegisteredUsers = event.registeredUsers.length;

    if (totalSeats <= 0) {
      return next(new HttpError(400, "Total seats must be greater than 0"));
    }

    if (totalSeats < totalRegisteredUsers) {
      return next(
        new HttpError(
          400,
          "Total seats must be greater than or equal to the number of registered users"
        )
      );
    }

    if (remainingSeats > totalSeats) {
      return next(
        new HttpError(400, "Remaining seats cannot exceed total seats.")
      );
    }

    if (remainingSeats > totalSeats - totalRegisteredUsers) {
      return next(
        new HttpError(
          400,
          "Remaining seats must not be more than the available seats after accounting for registered users"
        )
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

    event.title = title;
    event.description = description;
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

    const match = {};
    if (search) {
      match.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const event = await Event.findById(id).populate({
      path: "registeredUsers.user",
      match: match,
      options: {
        limit: pageSize,
        skip: skip,
      },
      select: "firstName lastName phone",
    });

    if (!event) {
      return next(new HttpError(404, "Event not found"));
    }

    const total = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$registeredUsers" },
      {
        $lookup: {
          from: "users",
          localField: "registeredUsers.user",
          foreignField: "_id",
          as: "registeredUsers.user",
        },
      },
      { $unwind: "$registeredUsers.user" },
      {
        $match: match,
      },
      { $count: "total" },
    ]);

    const registeredUsers = event.registeredUsers
      .filter((regUser) => regUser.user)
      .map((regUser) => ({
        _id: regUser.user._id,
        firstName: regUser.user.firstName,
        lastName: regUser.user.lastName,
        phone: regUser.user.phone,
        joinDate: regUser.joinDate,
      }));

    res.status(200).json({
      success: true,
      data: registeredUsers,
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

const joinEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new HttpError(400, "Invalid event ID"));
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return next(new HttpError(404, "Event not found"));
    }

    if (event.remainingSeats <= 0) {
      return next(new HttpError(400, "Event is full"));
    }

    const isAlreadyRegistered = event.registeredUsers.some(
      (user) => user.user.toString() === userId
    );

    if (isAlreadyRegistered) {
      return next(
        new HttpError(400, "User is already registered for this event")
      );
    }

    event.registeredUsers.push({ user: userId });
    event.remainingSeats -= 1;

    await event.save();

    res.status(200).json({
      success: true,
      message: "User successfully joined the event",
    });
  } catch (error) {
    next(error);
  }
};

export {
  create,
  findAll,
  findOne,
  update,
  remove,
  findRegisteredUsers,
  joinEvent,
};
