import createError from "http-errors";
import Booking from "../models/bookings.model";

const getAll = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const sortField = query.sort_by || "createdAt";
  const sortType = query.sort_type === "asc" ? 1 : -1;
  const sortObject: Record<string, 1 | -1> = { [sortField]: sortType };

  const where: Record<string, any> = {};

  // filter by customerId, roomId, paymentStatus
  if (query.customerId) where.customerId = query.customerId;
  if (query.roomId) where.roomId = query.roomId;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

  // filter by date range
  if (query.startDate || query.endDate) {
    where.checkIn = {};
    if (query.startDate) where.checkIn.$gte = new Date(query.startDate);
    if (query.endDate) where.checkIn.$lte = new Date(query.endDate);
  }

  const bookings = await Booking.find(where)
    .populate("customerId", "fullName email phoneNumber")
    .populate("roomId", "roomNumber typeId")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortObject);

  const count = await Booking.countDocuments(where);

  return {
    bookings,
    pagination: {
      totalRecord: count,
      limit,
      page,
    },
  };
};

const getById = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate("customerId", "fullName email phoneNumber")
    .populate("roomId", "roomNumber typeId");
  if (!booking) throw createError(404, "Booking not found");
  return booking;
};

const create = async (payload: any) => {
    const booking = new Booking({
      customerId: payload.customerId,
      roomId: payload.roomId,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      guests: payload.guests,
      totalPrice: payload.totalPrice,
      paymentStatus: payload.paymentStatus || "pending",
      notes: payload.notes || "",
    });
  
    const savedBooking = await booking.save();
    await savedBooking.populate("customerId", "fullName email phoneNumber");
    await savedBooking.populate("roomId", "roomNumber typeId");
    return savedBooking;
  };
  
  const updateById = async (id: string, payload: any) => {
    const booking = await getById(id);
  
    const cleanUpdates = Object.fromEntries(
      Object.entries(payload).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );
  
    Object.assign(booking, cleanUpdates);
    const updatedBooking = await booking.save();
    await updatedBooking.populate("customerId", "fullName email phoneNumber");
    await updatedBooking.populate("roomId", "roomNumber typeId");
    return updatedBooking;
  };
  

const deleteById = async (id: string) => {
  const booking = await getById(id);
  await booking.deleteOne();
  return booking;
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
