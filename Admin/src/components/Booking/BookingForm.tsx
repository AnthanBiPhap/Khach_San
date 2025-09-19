import {
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import type { Booking } from "../../types/booking";

const { Option } = Select;
const { TextArea } = Input;

interface RoomType {
  _id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
}

interface Room {
  _id: string;
  roomNumber: string;
  typeId?: RoomType;
  status: string;
  amenities?: string[];
}

interface BookingFormProps {
  open: boolean;
  booking?: Booking | null;
  onCancel: () => void;
  onSave: (values: Partial<Booking>) => Promise<void>;
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

  const [users, setUsers] = useState<{ _id: string; fullName: string }[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

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

    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await axios.get("http://localhost:8080/api/v1/rooms");
        setRooms(res.data?.data?.rooms || []);
      } catch {
        message.error("Không tải được danh sách phòng");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchUsers();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        ...booking,
        checkIn: booking.checkIn ? dayjs(booking.checkIn) : null,
        checkOut: booking.checkOut ? dayjs(booking.checkOut) : null,
      });
    } else {
      form.resetFields();
    }
  }, [booking, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        customerId: values.customerId,
        roomId: values.roomId,
        guests: values.guests,
        checkIn: values.checkIn?.toISOString(),
        checkOut: values.checkOut?.toISOString(),
        totalPrice: values.totalPrice,
        status: values.status,
        paymentStatus: values.paymentStatus,
        notes: values.notes,
      });
    } catch (error) {
      console.error(error);
      message.error("Vui lòng điền đủ thông tin");
    }
  };
  

  return (
    <Modal
      open={open}
      title={booking ? "Chỉnh sửa đặt phòng" : "Tạo đặt phòng mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
      <Form.Item
          name="customerId"
          label="Khách hàng"
          rules={[{ required: true, message: "Chọn khách hàng" }]}
        >
          <Select
            showSearch
    placeholder="Chọn khách hàng"
    loading={loadingUsers}
    filterOption={(input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
    }
    options={users.map(u => ({
      label: u.fullName,
      value: u._id,
    }))}
  />
</Form.Item>

<Form.Item
  name="roomId"
  label="Phòng"
  rules={[{ required: true, message: "Chọn phòng" }]}
>
  <Select
    showSearch
    placeholder="Chọn phòng"
    loading={loadingRooms}
    filterOption={(input, option) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
    }
    options={rooms.map(r => ({
      label: r.roomNumber,   // dùng roomNumber để hiển thị
      value: r._id,
    }))}
  />
</Form.Item>

        <Form.Item
          name="checkIn"
          label="Ngày nhận phòng"
          rules={[{ required: true, message: "Vui lòng chọn ngày nhận phòng" }]}
        >
          <DatePicker style={{ width: "100%" }} showTime format="DD/MM/YYYY HH:mm" />
        </Form.Item>

        <Form.Item
          name="checkOut"
          label="Ngày trả phòng"
          rules={[{ required: true, message: "Vui lòng chọn ngày trả phòng" }]}
        >
          <DatePicker style={{ width: "100%" }} showTime format="DD/MM/YYYY HH:mm" />
        </Form.Item>

        <Form.Item
  name="guests"
  label="Số lượng khách"
  rules={[{ required: true, message: "Nhập số lượng khách" }]}
>
  <InputNumber min={1} style={{ width: "100%" }} />
</Form.Item>

<Form.Item name="notes" label="Ghi chú">
  <TextArea rows={4} />
</Form.Item>

        <Form.Item
          name="totalPrice"
          label="Tổng tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `₫${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="completed">Hoàn thành</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="paymentStatus"
          label="Trạng thái thanh toán"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
        >
          <Select>
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="refunded">Hoàn tiền</Option>
            <Option value="failed">Thanh toán thất bại</Option>
          </Select>
        </Form.Item>

        <Form.Item name="specialRequests" label="Yêu cầu đặc biệt">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
