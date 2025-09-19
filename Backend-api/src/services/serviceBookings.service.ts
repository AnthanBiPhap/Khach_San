import createError from "http-errors";
import ServiceBooking from "../models/serviceBookings.model";

const getAll = async (query: any) => {
  const pageNum = Number(query.page) || 1;
  const limitNum = Number(query.limit) || 10;

  const sortType = query.sort_type === "asc" ? 1 : -1;
  const sortBy = query.sort_by || "createdAt";
  const sortObject: any = { [sortBy]: sortType };

  // Build query conditions
  const where: any = {};
  if (query.bookingId) where.bookingId = query.bookingId;
  if (query.serviceId) where.serviceId = query.serviceId;
  if (query.customerId) where.customerId = query.customerId;
  if (query.status) where.status = query.status;

  const serviceBookings = await ServiceBooking.find(where)
    .populate("bookingId", "_id checkIn checkOut")
    .populate("serviceId", "name price")
    .populate("customerId", "fullName email phoneNumber")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .sort(sortObject);

  const count = await ServiceBooking.countDocuments(where);

  return {
    serviceBookings,
    pagination: {
      totalRecord: count,
      limit: limitNum,
      page: pageNum,
    },
  };
};

const getById = async (id: string) => {
  const serviceBooking = await ServiceBooking.findById(id)
    .populate("bookingId", "_id checkIn checkOut")
    .populate("serviceId", "name price description")
    .populate("customerId", "fullName email phoneNumber");

  if (!serviceBooking) {
    throw createError(404, "Service booking not found");
  }
  return serviceBooking;
};

const create = async (payload: any) => {
  // Check if the service booking already exists
  const existingBooking = await ServiceBooking.findOne({
    bookingId: payload.bookingId,
    serviceId: payload.serviceId,
    scheduledAt: payload.scheduledAt,
  });

  if (existingBooking) {
    throw createError(400, "Service booking already exists for this time slot");
  }

  const serviceBooking = new ServiceBooking({
    bookingId: payload.bookingId,
    serviceId: payload.serviceId,
    customerId: payload.customerId,
    scheduledAt: payload.scheduledAt,
    quantity: payload.quantity || 1,
    price: payload.price,
    status: payload.status || "reserved",
  });

  await serviceBooking.save();
  return serviceBooking;
};

const updateById = async (id: string, payload: any) => {
  const serviceBooking = await getById(id);

  // If updating scheduled time, check for conflicts
  if (
    payload.scheduledAt &&
    new Date(payload.scheduledAt).getTime() !==
      new Date(serviceBooking.scheduledAt).getTime()
  ) {
    const existingBooking = await ServiceBooking.findOne({
      _id: { $ne: id },
      serviceId: serviceBooking.serviceId,
      scheduledAt: payload.scheduledAt,
    });

    if (existingBooking) {
      throw createError(400, "Another booking already exists for this time slot");
    }
  }

  const cleanUpdates = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  Object.assign(serviceBooking, cleanUpdates);
  await serviceBooking.save();
  return serviceBooking;
};

const deleteById = async (id: string) => {
  const serviceBooking = await getById(id);
  await serviceBooking.deleteOne();
  return serviceBooking;
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
