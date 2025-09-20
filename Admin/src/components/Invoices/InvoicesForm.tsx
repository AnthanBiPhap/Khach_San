import { Form, InputNumber, Modal, Select, DatePicker, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import type { InvoiceItem } from "../../types/invoice";
import dayjs from "dayjs";

const { Option } = Select;

interface SimpleUser { _id: string; fullName?: string }
interface SimpleBooking { _id: string; checkIn?: string; checkOut?: string }

interface InvoicesFormProps {
  open: boolean;
  item?: InvoiceItem | null;
  onCancel: () => void;
  onSave: (values: Partial<InvoiceItem>) => Promise<void>;
  loading?: boolean;
}

export default function InvoicesForm({ open, item, onCancel, onSave, loading }: InvoicesFormProps) {
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
    if (item) {
      form.setFieldsValue({
        bookingId: item.bookingId?._id,
        customerId: item.customerId?._id,
        totalAmount: item.totalAmount,
        status: item.status,
        issuedAt: item.issuedAt ? dayjs(item.issuedAt) : null,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      bookingId: values.bookingId,
      customerId: values.customerId,
      totalAmount: values.totalAmount,
      status: values.status,
      issuedAt: values.issuedAt?.toISOString(),
    } as Partial<InvoiceItem>);
  };

  return (
    <Modal
      open={open}
      title={item ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="bookingId" label="Booking" rules={[{ required: true, message: "Chọn booking" }]}>
          <Select
            showSearch
            placeholder="Chọn booking"
            loading={loadingBookings}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={bookings.map(b => ({ label: b._id?.slice(0,8)+"...", value: b._id }))}
          />
        </Form.Item>

        <Form.Item name="customerId" label="Khách hàng">
          <Select
            showSearch
            allowClear
            placeholder="Chọn khách hàng"
            loading={loadingUsers}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={users.map(u => ({ label: u.fullName || u._id, value: u._id }))}
          />
        </Form.Item>

        <Form.Item name="totalAmount" label="Tổng tiền" rules={[{ required: true, message: "Nhập tổng tiền" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select>
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="failed">Thất bại</Option>
            <Option value="refunded">Hoàn tiền</Option>
          </Select>
        </Form.Item>

        <Form.Item name="issuedAt" label="Ngày phát hành">
          <DatePicker style={{ width: "100%" }} showTime format="DD/MM/YYYY HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
