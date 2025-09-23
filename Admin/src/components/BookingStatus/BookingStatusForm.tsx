import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import type { BookingStatusLog } from "../../types/bookingstatus";

const { Option } = Select;
const { TextArea } = Input;

interface SimpleUser { _id: string; fullName: string; email?: string }
interface SimpleBooking {
  _id: string;
  checkIn?: string;
  checkOut?: string;
  roomId?: {
    _id: string;
    roomNumber?: string;
    typeId?: string;
  };
  customerId?: { fullName?: string; phoneNumber?: string; idNumber?: string };
  guestInfo?: { fullName?: string; phoneNumber?: string; idNumber?: string };
}


interface BookingFormProps {
  open: boolean;
  booking?: BookingStatusLog | null;
  onCancel: () => void;
  onSave: (values: Partial<BookingStatusLog>) => Promise<void>;
  loading?: boolean;
}

export default function BookingForm({
  open,
  booking,
  onCancel,
  onSave,
  loading,
}: BookingFormProps) {
  const [form] = Form.useForm();

  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [bookings, setBookings] = useState<SimpleBooking[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await axios.get("http://localhost:8080/api/v1/users");
        setUsers(res.data?.data?.users || []);
      } catch {
        message.error("Không tải được danh sách người dùng");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const res = await axios.get("http://localhost:8080/api/v1/bookings");
        setBookings(res.data?.data?.bookings || []);
      } catch {
        message.error("Không tải được danh sách booking");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUsers();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        bookingId: booking.bookingId?._id,
        actorId: booking.actorId?._id || (booking.actorName ? "system" : undefined),
        action: booking.action,
        note: booking.note,
      });
    } else {
      form.resetFields();
    }
  }, [booking, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: Partial<BookingStatusLog> = {
        bookingId: values.bookingId,
        action: values.action,
        note: values.note,
      };

      if (values.actorId === "system") {
        payload.actorId = null;
        payload.actorName = "Admin / Lễ tân";
      } else {
        payload.actorId = values.actorId;
        payload.actorName = undefined;
      }

      await onSave(payload);
    } catch (error) {
      console.error(error);
      message.error("Vui lòng điền đủ thông tin");
    }
  };

  const formatBookingLabel = (b: SimpleBooking) => {
    const name = b.customerId?.fullName || b.guestInfo?.fullName || "-";
    const phone = b.customerId?.phoneNumber || b.guestInfo?.phoneNumber || "-";
    // const idNum = b.customerId?.idNumber || b.guestInfo?.idNumber || "-";
    const room = b.roomId?.roomNumber || "-"; // dùng roomId.roomNumber
    const checkIn = b.checkIn ? new Date(b.checkIn).toLocaleString("vi-VN") : "-";
    const checkOut = b.checkOut ? new Date(b.checkOut).toLocaleString("vi-VN") : "-";
    return `${name} | ${phone} |  | Phòng: ${room} | Nhận: ${checkIn} | Trả: ${checkOut}`;
  };


  return (
    <Modal
      open={open}
      title={booking ? "Chỉnh sửa log" : "Tạo log mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="bookingId"
          label="Booking"
          rules={[{ required: true, message: "Chọn booking" }]}
        >
          <Select
            showSearch
            placeholder="Chọn booking"
            loading={loadingBookings}
            filterOption={(input, option) =>
              ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={bookings.map(b => ({
              label: formatBookingLabel(b),
              value: b._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="actorId"
          label="Người thao tác"
          rules={[{ required: true, message: "Chọn người thao tác" }]}
        >
          <Select
            showSearch
            placeholder="Chọn người thao tác"
            loading={loadingUsers}
            filterOption={(input, option) =>
              ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              ...users.map(u => ({ label: u.fullName, value: u._id })),
              { label: "Admin / Lễ tân", value: "system" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="action"
          label="Hành động"
          rules={[{ required: true, message: "Chọn hành động" }]}
        >
          <Select>
            <Option value="check_in">Check-in</Option>
            <Option value="check_out">Check-out</Option>
            <Option value="cancel">Hủy</Option>
            <Option value="extend">Gia hạn</Option>
            <Option value="extend_check_out">Lùi giờ trả</Option>
          </Select>
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
