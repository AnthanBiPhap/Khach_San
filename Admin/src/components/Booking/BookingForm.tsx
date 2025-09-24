import {
  Form,
  Input,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import type { Booking } from "../../types/booking";
import type { Room } from "../../types/booking";
import type { BookingFormProps } from "../../types/booking";

const { Option } = Select;
const { TextArea } = Input;

export default function BookingForm({
  open,
  booking,
  onCancel,
  onSave,
  loading,
}: BookingFormProps) {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // --- trạng thái mới ---
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
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

    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/bookings");
        setBookings(res.data?.data?.bookings || []);
      } catch {
        message.error("Không tải được danh sách booking");
      }
    };

    fetchRooms();
    fetchBookings();
  }, []);

  // --- fill form khi edit ---
  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        ...booking,
        checkIn: booking.checkIn ? dayjs(booking.checkIn) : null,
        checkOut: booking.checkOut ? dayjs(booking.checkOut) : null,
        totalPrice: booking.totalPrice,
        guestInfo: booking.guestInfo || {}
      });
      setCheckIn(booking.checkIn ? dayjs(booking.checkIn) : null);
      setCheckOut(booking.checkOut ? dayjs(booking.checkOut) : null);
      const room = rooms.find(r => r._id === booking.roomId._id) || null;
      setSelectedRoom(room);
    } else {
      form.resetFields();
      setCheckIn(null);
      setCheckOut(null);
      setSelectedRoom(null);
      setTotalPrice(0);
    }
  }, [booking, rooms]);

  // --- lọc phòng theo ngày ---
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setAvailableRooms([]);
      return;
    }
    const filtered = rooms.filter(room => {
      return !bookings.some(b => b.roomId._id === room._id &&
        (dayjs(b.checkIn).isBefore(checkOut) && dayjs(b.checkOut).isAfter(checkIn))
      );
    });
    setAvailableRooms(filtered);
  }, [checkIn, checkOut, rooms, bookings]);

  // --- tính tổng tiền ---
  useEffect(() => {
    if (selectedRoom?.typeId && checkIn && checkOut) {
      const nights = checkOut.diff(checkIn, "day");
      const total = nights * selectedRoom.typeId.pricePerNight;
      setTotalPrice(total);
      form.setFieldsValue({ totalPrice: total });
    } else {
      setTotalPrice(0);
      form.setFieldsValue({ totalPrice: 0 });
    }
  }, [selectedRoom, checkIn, checkOut, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        guestInfo: {
          fullName: values.guestInfo.fullName,
          phoneNumber: values.guestInfo.phoneNumber,
          idNumber: values.guestInfo.idNumber,
          age: values.guestInfo.age,
        },
        roomId: values.roomId,
        checkIn: values.checkIn?.toISOString(),
        checkOut: values.checkOut?.toISOString(),
        guests: values.guests,
        totalPrice: totalPrice,
        status: values.status,
        paymentStatus: values.paymentStatus,
        notes: values.notes,
        specialRequests: values.specialRequests,
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
      style={{ top: 50 }}
      okText={booking ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy bỏ"
    >
      <Form form={form} layout="vertical" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <Typography.Title level={5} style={{ marginBottom: '12px', fontSize: '14px' }}>Thông tin khách hàng</Typography.Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["guestInfo", "fullName"]}
                label="Họ và tên"
                rules={[{ required: true, message: "Nhập họ và tên khách" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["guestInfo", "phoneNumber"]}
                label="Số điện thoại"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={["guestInfo", "idNumber"]}
                label="CMND/CCCD"
                rules={[{ required: true, message: "Nhập CMND/CCCD" }]}
              >
                <Input placeholder="Nhập số CMND/CCCD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["guestInfo", "age"]} label="Tuổi">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập tuổi" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <Typography.Title level={5} style={{ marginBottom: '12px', fontSize: '14px' }}>Thông tin đặt phòng</Typography.Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="checkIn"
                label="Ngày nhận phòng"
                rules={[{ required: true, message: "Vui lòng chọn ngày nhận phòng" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  onChange={date => setCheckIn(date)}
                  placeholder="Nhận phòng"
                  size="small"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkOut"
                label="Ngày trả phòng"
                rules={[{ required: true, message: "Vui lòng chọn ngày trả phòng" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  onChange={date => setCheckOut(date)}
                  placeholder="Trả phòng"
                  size="small"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomId"
                label="Chọn phòng"
                rules={[{ required: true, message: "Chọn phòng" }]}
              >
                <Select
                  showSearch
                  placeholder={checkIn && checkOut ? "Chọn phòng" : "Chọn ngày trước"}
                  disabled={!checkIn || !checkOut}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={availableRooms.map(r => ({
                    label: `${r.roomNumber} - ${r.typeId?.name}`,
                    value: r._id,
                  }))}
                  onChange={value => {
                    const room = availableRooms.find(r => r._id === value) || null;
                    setSelectedRoom(room);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="guests"
                label="Số lượng khách"
                rules={[{ required: true, message: "Nhập số lượng khách" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} placeholder="Số khách" size="small" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tổng tiền">
                <div style={{ padding: '8px 0' }}>
                  <Typography.Text strong style={{ fontSize: '14px' }}>
                    {totalPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice) : '0 ₫'}
                  </Typography.Text>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>



        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <Typography.Title level={5} style={{ marginBottom: '12px', fontSize: '14px' }}>Thông tin thanh toán</Typography.Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái đặt phòng"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="completed">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentStatus"
                label="Trạng thái thanh toán"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
              >
                <Select placeholder="Chọn trạng thái thanh toán">
                  <Option value="pending">Chờ thanh toán</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="refunded">Hoàn tiền</Option>
                  <Option value="failed">Thanh toán thất bại</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="notes" label="Ghi chú" style={{ marginBottom: 0 }}>
                <TextArea rows={1} placeholder="Nhập ghi chú (nếu có)" style={{ resize: 'none' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
}
