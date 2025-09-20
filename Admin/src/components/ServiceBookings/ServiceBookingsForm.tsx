import { Form, InputNumber, Modal, Select, DatePicker, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import type { ServiceBookingItem } from "../../types/serviceBooking";
import dayjs from "dayjs";

const { Option } = Select;

interface SimpleRef { _id: string; name?: string; fullName?: string }

interface ServiceBookingsFormProps {
  open: boolean;
  item?: ServiceBookingItem | null;
  onCancel: () => void;
  onSave: (values: Partial<ServiceBookingItem>) => Promise<void>;
  loading?: boolean;
}

export default function ServiceBookingsForm({ open, item, onCancel, onSave, loading }: ServiceBookingsFormProps) {
  const [form] = Form.useForm();
  const [services, setServices] = useState<SimpleRef[]>([]);
  const [bookings, setBookings] = useState<SimpleRef[]>([]);
  const [users, setUsers] = useState<SimpleRef[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await axios.get("http://localhost:8080/api/v1/services");
        const arr = res.data?.data?.data || res.data?.data?.services || [];
        setServices(arr);
      } catch {
        message.error("Không tải được danh sách dịch vụ");
      } finally {
        setLoadingServices(false);
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

    fetchServices();
    fetchBookings();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        bookingId: item.bookingId?._id,
        serviceId: item.serviceId?._id,
        customerId: item.customerId?._id,
        scheduledAt: item.scheduledAt ? dayjs(item.scheduledAt) : null,
        quantity: item.quantity,
        price: item.price,
        status: item.status,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        bookingId: values.bookingId,
        serviceId: values.serviceId,
        customerId: values.customerId,
        scheduledAt: values.scheduledAt?.toISOString(),
        quantity: values.quantity,
        price: values.price,
        status: values.status,
      } as Partial<ServiceBookingItem>);
    } catch (e) {
      // validation error already shown
    }
  };

  return (
    <Modal
      open={open}
      title={item ? "Chỉnh sửa lịch dịch vụ" : "Tạo lịch dịch vụ"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true, message: "Chọn dịch vụ" }]}>
          <Select
            showSearch
            placeholder="Chọn dịch vụ"
            loading={loadingServices}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={services.map(s => ({ label: s.name || s._id, value: s._id }))}
          />
        </Form.Item>

        <Form.Item name="bookingId" label="Booking">
          <Select
            showSearch
            allowClear
            placeholder="Chọn booking (không bắt buộc)"
            loading={loadingBookings}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={bookings.map(b => ({ label: b._id?.slice(0,8)+"...", value: b._id }))}
          />
        </Form.Item>

        <Form.Item name="customerId" label="Khách hàng">
          <Select
            showSearch
            allowClear
            placeholder="Chọn khách hàng (không bắt buộc)"
            loading={loadingUsers}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={users.map(u => ({ label: u.fullName || u._id, value: u._id }))}
          />
        </Form.Item>

        <Form.Item name="scheduledAt" label="Thời gian" rules={[{ required: true, message: "Chọn thời gian" }]}>
          <DatePicker style={{ width: "100%" }} showTime format="DD/MM/YYYY HH:mm" />
        </Form.Item>

        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: "Nhập số lượng" }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="price" label="Giá" rules={[{ required: true, message: "Nhập giá" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select>
            <Option value="reserved">Đã đặt</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
