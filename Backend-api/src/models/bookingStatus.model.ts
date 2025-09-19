import { Schema, model } from "mongoose";

const bookingStatusLogSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Cần chỉ định booking"],
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User", // ai đổi trạng thái: admin, lễ tân...
      required: [true, "Thiếu thông tin người thay đổi"],
    },
    action: {
      type: String,
      enum: ["check_in", "check_out", "cancel","extend", "extend_check_out"],
      required: [true, "Thiếu thông tin hành động"],
    },
    note: {
      type: String,
      trim: true, // ghi chú (nếu có)
    },
  },
  {
    timestamps: false, // vì đã có changedAt riêng
    versionKey: false,
  }
);

export default model("BookingStatusLog", bookingStatusLogSchema);
