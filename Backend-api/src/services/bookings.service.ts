import createError from "http-errors";
import Booking from "../models/bookings.model";
import ServiceBooking from "../models/serviceBookings.model";

// Lấy tất cả booking với filter + pagination
const getAll = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const sortField = query.sort_by || "createdAt";
  const sortType = query.sort_type === "asc" ? 1 : -1;
  const sortObject: Record<string, 1 | -1> = { [sortField]: sortType };

  const where: Record<string, any> = {};

  // filter theo customerId, roomId, paymentStatus
  if (query.customerId) where.customerId = query.customerId;
  if (query.roomId) where.roomId = query.roomId;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

  // filter theo ngày
  if (query.startDate || query.endDate) {
    where.checkIn = {};
    if (query.startDate) where.checkIn.$gte = new Date(query.startDate);
    if (query.endDate) where.checkIn.$lte = new Date(query.endDate);
  }

  // filter theo guestInfo.fullName (khách walk-in)
  if (query.guestName) {
    where["guestInfo.fullName"] = { $regex: query.guestName, $options: "i" };
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
    pagination: { totalRecord: count, limit, page },
  };
};

// Lấy booking theo id
const getById = async (id: string) => {
  const booking = await Booking.findById(id)
    .populate("customerId", "fullName email phoneNumber")
    .populate("roomId", "roomNumber typeId");
  if (!booking) throw createError(404, "Booking not found");
  return booking;
};

// Tạo booking mới
const create = async (payload: any) => {
  const { roomId, checkIn, checkOut, services = [] } = payload;

  // check trùng phòng
  const conflict = await Booking.findOne({
    roomId,
    status: { $nin: ["cancelled"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });
  if (conflict) throw createError(400, "Phòng đã được đặt trong khoảng thời gian này");

  // Tạo booking
  const booking = new Booking({
    customerId: payload.customerId || undefined, // optional
    guestInfo: payload.guestInfo,              // bắt buộc cho walk-in
    roomId,
    checkIn,
    checkOut,
    guests: payload.guests,
    totalPrice: payload.totalPrice,
    paymentStatus: payload.paymentStatus || "pending",
    notes: payload.notes || "",
    status: payload.status || "pending",
    specialRequests: payload.specialRequests || "",
    services: services.map((s: any) => ({
      serviceId: s.serviceId,
      name: s.name,
      price: s.price,
      quantity: s.quantity
    }))
  });

  try {
    // Lưu booking
    const savedBooking = await booking.save();
    
    // Tạo các service booking nếu có
    if (services && services.length > 0) {
      const serviceBookings = services.map((service: any) => ({
        bookingId: savedBooking._id,
        serviceId: service.serviceId,
        customerId: payload.customerId || null,
        scheduledAt: new Date(checkIn), // Mặc định lấy thời gian check-in
        quantity: service.quantity || 1,
        price: service.price,
        status: 'reserved'
      }));

      await ServiceBooking.insertMany(serviceBookings);
    }

    // Populate thông tin để trả về
    await savedBooking.populate("customerId", "fullName email phoneNumber");
    await savedBooking.populate("roomId", "roomNumber typeId");
    
    return savedBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Cập nhật booking
const updateById = async (id: string, payload: any) => {
  const booking = await getById(id);

  const roomId = payload.roomId ?? booking.roomId;
  const checkIn = payload.checkIn ?? booking.checkIn;
  const checkOut = payload.checkOut ?? booking.checkOut;

  // check trùng phòng
  const conflict = await Booking.findOne({
    _id: { $ne: id },
    roomId,
    status: { $nin: ["cancelled"] },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });
  if (conflict) throw createError(400, "Phòng đã được đặt trong khoảng thời gian này");

  // lọc payload hợp lệ
  const cleanUpdates = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  );

  Object.assign(booking, cleanUpdates);
  const updatedBooking = await booking.save();
  await updatedBooking.populate("customerId", "fullName email phoneNumber");
  await updatedBooking.populate("roomId", "roomNumber typeId");
  return updatedBooking;
};

// Xoá booking
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
