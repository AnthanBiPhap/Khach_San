import { Form, Input, Modal, Select, DatePicker, InputNumber, message, Row, Col, Typography, Button, Divider } from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import type { Booking } from "../../types/booking";
import type { Room } from "../../types/booking";
import type { BookingFormProps } from "../../types/booking";

interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  slots: string[];
  images: string[];
  status: string;
}

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
  const [services, setServices] = useState<Service[]>([]);
  // Define the service item type
  interface ServiceItem {
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }

  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);

  // --- trạng thái mới ---
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [roomPrice, setRoomPrice] = useState<number>(0);
  const [servicesPrice, setServicesPrice] = useState<number>(0);
  const totalPrice = roomPrice + servicesPrice;

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsRes = await axios.get("http://localhost:8080/api/v1/rooms");
        setRooms(roomsRes.data?.data?.rooms || []);
        
        // Fetch bookings
        const bookingsRes = await axios.get("http://localhost:8080/api/v1/bookings");
        setBookings(bookingsRes.data?.data?.bookings || []);
        
        // Fetch services
        const servicesRes = await axios.get("http://localhost:8080/api/v1/services");
        setServices(servicesRes.data?.data?.data || servicesRes.data?.data?.services || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    fetchData();
  }, []);

  // Calculate room price when check-in/out or room changes
  useEffect(() => {
    if (selectedRoom?.typeId?.pricePerNight && checkIn && checkOut) {
      const nights = checkOut.diff(checkIn, "day") || 1;
      const price = nights * selectedRoom.typeId.pricePerNight;
      setRoomPrice(price);
    } else {
      setRoomPrice(0);
    }
  }, [selectedRoom, checkIn, checkOut]);

  // Calculate services price when selected services change
  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => {
      return sum + (service.price * service.quantity);
    }, 0);
    setServicesPrice(total);
  }, [selectedServices]);

  // Fill form when editing
  useEffect(() => {
    if (booking) {
      form.setFieldsValue({
        ...booking,
        checkIn: booking.checkIn ? dayjs(booking.checkIn) : null,
        checkOut: booking.checkOut ? dayjs(booking.checkOut) : null,
        guestInfo: booking.guestInfo || {}
      });
      setCheckIn(booking.checkIn ? dayjs(booking.checkIn) : null);
      setCheckOut(booking.checkOut ? dayjs(booking.checkOut) : null);
      
      // Handle room selection
      const roomId = typeof booking.roomId === 'string' ? booking.roomId : booking.roomId._id;
      const room = rooms.find(r => r._id === roomId) || null;
      setSelectedRoom(room);
      
      // Set selected services if editing
      if (booking.services && booking.services.length > 0) {
        setSelectedServices(booking.services.map(s => ({
          serviceId: typeof s.serviceId === 'string' ? s.serviceId : s.serviceId._id,
          name: s.name,
          price: s.price,
          quantity: s.quantity || 1
        })));
      }
    } else {
      form.resetFields();
      setCheckIn(null);
      setCheckOut(null);
      setSelectedRoom(null);
      setSelectedServices([]);
      setRoomPrice(0);
      setServicesPrice(0);
    }
  }, [booking, rooms, form]);

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

  // Calculate total price when room or dates change
  useEffect(() => {
    if (selectedRoom?.typeId?.pricePerNight && checkIn && checkOut) {
      const nights = checkOut.diff(checkIn, "day") || 1;
      const price = nights * selectedRoom.typeId.pricePerNight;
      setRoomPrice(price);
    } else {
      setRoomPrice(0);
    }
  }, [selectedRoom, checkIn, checkOut]);

  const handleAddService = (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;

    setSelectedServices(prev => {
      const existing = prev.find(s => s.serviceId === serviceId);
      if (existing) {
        return prev.map(s => 
          s.serviceId === serviceId 
            ? { ...s, quantity: s.quantity + 1 } 
            : s
        );
      }
      return [
        ...prev, 
        { 
          serviceId: service._id, 
          name: service.name, 
          price: service.basePrice, 
          quantity: 1 
        }
      ];
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.serviceId === serviceId);
      if (existing && existing.quantity > 1) {
        return prev.map(s => 
          s.serviceId === serviceId 
            ? { ...s, quantity: s.quantity - 1 } 
            : s
        );
      }
      return prev.filter(s => s.serviceId !== serviceId);
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare the booking data to be saved
      const bookingData: Partial<Booking> = {
        ...values,
        checkIn: values.checkIn?.toISOString(),
        checkOut: values.checkOut?.toISOString(),
        totalPrice,
        services: selectedServices.map(s => ({
          serviceId: s.serviceId,
          name: s.name,
          price: s.price,
          quantity: s.quantity
        }))
      };
      
      // Call the onSave prop with the booking data
      onSave(bookingData);
      
      // Reset form after successful submission for new bookings
      if (!booking) {
        form.resetFields();
        setSelectedServices([]);
        setRoomPrice(0);
        setServicesPrice(0);
        setCheckIn(null);
        setCheckOut(null);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Vui lòng kiểm tra lại thông tin đặt phòng');
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <Modal
      open={open}
      title={booking ? "Chỉnh sửa đặt phòng" : "Tạo đặt phòng mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      style={{ top: 20 }}
      okText={booking ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy bỏ"
    >
      <Form form={form} layout="vertical" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
                name={["guestInfo", "email"]}
                label="Email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="Nhập email (nếu có)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name={["guestInfo", "idNumber"]}
                label="CMND/CCCD"
                rules={[{ required: true, message: "Nhập CMND/CCCD" }]}
              >
                <Input placeholder="Số CMND/CCCD" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item 
                name={["guestInfo", "age"]} 
                label="Tuổi"
                rules={[{ type: 'number', min: 0, message: 'Tuổi không hợp lệ' }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="Tuổi" />
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
          </Row>

          {/* Services Section */}
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <Typography.Title level={5} style={{ marginBottom: '12px', fontSize: '14px' }}>Dịch vụ đi kèm</Typography.Title>
            
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={24}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Chọn dịch vụ"
                  onChange={(value) => {
                    const service = services.find(s => s._id === value);
                    if (service) {
                      handleAddService(service._id);
                    }
                  }}
                  value={null}
                >
                  {services
                    .filter(service => !selectedServices.some(s => s.serviceId === service._id))
                    .map(service => (
                      <Select.Option key={service._id} value={service._id}>
                        {service.name} - {formatPrice(service.basePrice)}
                      </Select.Option>
                    ))}
                </Select>
              </Col>
            </Row>

            {selectedServices.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4>Dịch vụ đã chọn:</h4>
                {selectedServices.map(service => (
                  <div key={service.serviceId} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #e8e8e8'
                  }}>
                    <div>
                      <div>{service.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatPrice(service.price)} x {service.quantity}
                      </div>
                    </div>
                    <div>
                      <Button 
                        icon={<MinusOutlined />} 
                        size="small" 
                        onClick={() => handleRemoveService(service.serviceId)}
                        style={{ marginRight: '8px' }}
                      />
                      <Button 
                        icon={<PlusOutlined />} 
                        size="small" 
                        onClick={() => handleAddService(service.serviceId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <Typography.Title level={5} style={{ marginBottom: '16px', fontSize: '14px' }}>Thông tin thanh toán</Typography.Title>
            
            {/* Tổng tiền phòng */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Tiền phòng:</span>
              <span>{formatPrice(roomPrice)}</span>
            </div>
            
            {/* Tổng tiền dịch vụ */}
            {selectedServices.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tiền dịch vụ:</span>
                <span>{formatPrice(servicesPrice)}</span>
              </div>
            )}
            
            {/* Tổng cộng */}
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
              <span>Tổng cộng:</span>
              <span style={{ color: '#1890ff' }}>{formatPrice(totalPrice)}</span>
            </div>
            <Divider style={{ margin: '12px 0' }} />
          
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
        </div>
      </Form>
    </Modal>
  );
}
