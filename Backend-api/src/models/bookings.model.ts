import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Thiếu thông tin khách hàng"],
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Thiếu thông tin phòng"],
    },
    checkIn: {
      type: Date,
      required: [true, "Ngày nhận phòng là bắt buộc"],
    },
    checkOut: {
      type: Date,
      required: [true, "Ngày trả phòng là bắt buộc"],
    },
    guests: {
      type: Number, // số lượng khách
      required: [true, "Cần khai báo số lượng khách"],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, "Tổng tiền là bắt buộc"],
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      type: String, // ghi chú thêm (ví dụ: yêu cầu giường phụ)
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Booking", bookingSchema);
