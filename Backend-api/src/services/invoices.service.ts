import createError from "http-errors";
import Invoice from "../models/invoices.model";

const getAll = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const sortField = query.sort_by || "createdAt";
  const sortType = query.sort_type === "asc" ? 1 : -1;
  const sortObject: Record<string, 1 | -1> = { [sortField]: sortType };

  const where: Record<string, any> = {};

  if (query.bookingId) where.bookingId = query.bookingId;
  if (query.customerId) where.customerId = query.customerId;
  if (query.status) where.status = query.status;

  // Filter tổng tiền
  if (query.minAmount || query.maxAmount) {
    where.totalAmount = {};
    if (query.minAmount) where.totalAmount.$gte = Number(query.minAmount);
    if (query.maxAmount) where.totalAmount.$lte = Number(query.maxAmount);
  }

  const invoices = await Invoice.find(where)
    .populate("bookingId", "_id checkIn checkOut")
    .populate("customerId", "fullName email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sortObject);

  const count = await Invoice.countDocuments(where);

  return {
    invoices,
    pagination: {
      totalRecord: count,
      limit,
      page,
    },
  };
};

const getById = async (id: string) => {
  const invoice = await Invoice.findById(id)
    .populate("bookingId", "_id checkIn checkOut")
    .populate("customerId", "fullName email");
  if (!invoice) throw createError(404, "Invoice not found");
  return invoice;
};

const create = async (payload: any) => {
  const invoice = new Invoice({
    bookingId: payload.bookingId,
    customerId: payload.customerId,
    totalAmount: payload.totalAmount,
    status: payload.status || "pending",
    issuedAt: payload.issuedAt || Date.now(),
  });
  await invoice.save();
  return invoice.populate("customerId", "fullName email");
};

const updateById = async (id: string, payload: any) => {
  const invoice = await getById(id);

  const cleanUpdates = Object.fromEntries(
    Object.entries(payload).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  Object.assign(invoice, cleanUpdates);
  await invoice.save();
  return invoice.populate("customerId", "fullName email");
};

const deleteById = async (id: string) => {
  const invoice = await getById(id);
  await invoice.deleteOne();
  return invoice;
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
