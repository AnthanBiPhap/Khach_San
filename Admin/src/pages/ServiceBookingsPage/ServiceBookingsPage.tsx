import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Card, Col, DatePicker, Descriptions, Form, Input, InputNumber, List, Modal, Row, Select, Space, Tag, message, Drawer } from "antd";
import { ShoppingCartOutlined, PlusOutlined } from "@ant-design/icons";
import type { ServiceBookingItem } from "../../types/serviceBooking";
import { fetchServiceBookings, deleteServiceBooking } from "../../services/serviceBookings.service";
import { env } from "../../constanst/getEnvs";
import { serviceBookingsColumns } from "../../components/ServiceBookings/ServiceBookingsColumns";
import ServiceBookingsForm from "../../components/ServiceBookings/ServiceBookingsForm";

export default function ServiceBookingsPage() {
  const [items, setItems] = useState<ServiceBookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ServiceBookingItem | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailItem, setDetailItem] = useState<ServiceBookingItem | null>(null);

  const load = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchServiceBookings(page, limit);
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list);
      setPagination({
        current: res.pagination?.page || 1,
        pageSize: res.pagination?.limit || 10,
        total: res.pagination?.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách lịch dịch vụ");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceBooking(id);
      message.success("Đã xóa lịch dịch vụ thành công");
      load(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Xóa lịch dịch vụ thất bại");
    }
  };

  const handleSave = async (values: Partial<ServiceBookingItem>) => {
    try {
      const url = editing
        ? `${env.API_URL}/api/v1/serviceBookings/${editing._id}`
        : `${env.API_URL}/api/v1/serviceBookings`;

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Có lỗi xảy ra");
      }

      message.success(editing ? "Cập nhật lịch dịch vụ thành công" : "Tạo lịch dịch vụ thành công");
      setOpenForm(false);
      setEditing(null);
      load(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error("Error saving service booking:", error);
      message.error(error.message || "Có lỗi xảy ra khi lưu lịch dịch vụ");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4}>
          <ShoppingCartOutlined /> Quản lý lịch dịch vụ
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          Thêm lịch
        </Button>
      </div>

      <Table
        columns={serviceBookingsColumns(
          (record) => {
            setEditing(record);
            setOpenForm(true);
          },
          handleDelete,
          (record) => {
            setDetailItem(record);
            setOpenDetail(true);
          }
        )}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} lịch dịch vụ`,
        }}
        onChange={(p) => load(p.current, p.pageSize)}
        bordered
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có dữ liệu" }}
      />

      <ServiceBookingsForm
        open={openForm}
        item={editing}
        onCancel={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSave={handleSave}
        loading={loading}
      />

      <Drawer
        title="Chi tiết lịch dịch vụ"
        open={openDetail}
        onClose={() => { setOpenDetail(false); setDetailItem(null); }}
        width={680}
      >
        {detailItem && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Dịch vụ" span={2}>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>
                {detailItem.serviceId?.name || detailItem.serviceId?._id || "-"}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="Thời gian thực hiện">
              {detailItem.scheduledAt ? new Date(detailItem.scheduledAt).toLocaleString("vi-VN") : "Chưa xác định"}
            </Descriptions.Item>
            
            <Descriptions.Item label="Số lượng">
              {detailItem.quantity} {detailItem.serviceId?.unit || 'lần'}
            </Descriptions.Item>
            
            <Descriptions.Item label="Đơn giá">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(detailItem.price)}
            </Descriptions.Item>
            
            <Descriptions.Item label="Thành tiền">
              <span style={{ fontWeight: 500, color: '#1890ff' }}>
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                  .format(detailItem.price * (detailItem.quantity || 1))}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="Trạng thái">
              <Tag 
                color={
                  detailItem.status === "reserved" ? "blue" : 
                  detailItem.status === "completed" ? "green" : 
                  detailItem.status === "cancelled" ? "red" : "default"
                }
              >
                {detailItem.status === "reserved" ? "Đã đặt" :
                 detailItem.status === "completed" ? "Hoàn thành" :
                 detailItem.status === "cancelled" ? "Đã hủy" : detailItem.status}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Thông tin đặt phòng" span={2}>
              <div style={{ marginTop: 8 }}>
                {detailItem.bookingId ? (
                  <div>
                    <div>Phòng: {(detailItem.bookingId as any)?.roomId?.roomNumber || 'N/A'}</div>
                    <div>Loại phòng: {(detailItem.bookingId as any)?.roomId?.typeId?.name || 'N/A'}</div>
                    <div>Nhận phòng: {(detailItem.bookingId as any)?.checkIn ? new Date((detailItem.bookingId as any).checkIn).toLocaleString('vi-VN') : 'N/A'}</div>
                    <div>Trả phòng: {(detailItem.bookingId as any)?.checkOut ? new Date((detailItem.bookingId as any).checkOut).toLocaleString('vi-VN') : 'N/A'}</div>
                    <div>Số khách: {(detailItem.bookingId as any)?.guests || 'N/A'}</div>
                    
                    {/* Hiển thị danh sách dịch vụ đã đặt */}
                    {(detailItem.bookingId as any)?.services?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div><strong>Dịch vụ đã đặt:</strong></div>
                        <List
                          size="small"
                          bordered
                          dataSource={(detailItem.bookingId as any)?.services || []}
                          renderItem={(service: any) => (
                            <List.Item>
                              <div style={{ width: '100%' }}>
                                <div>{service.name}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Số lượng: {service.quantity}</span>
                                  <span>{service.price?.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ) : 'Không có thông tin đặt phòng'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="Thông tin khách hàng" span={2}>
              <div style={{ marginTop: 8 }}>
                {(() => {
                  // Lấy thông tin từ customerId (nếu có)
                  const customer = detailItem.customerId || (detailItem.bookingId as any)?.customerId;
                  if (customer) {
                    return (
                      <div>
                        <div>Tên: {customer.fullName || 'Chưa có tên'}</div>
                        <div>Điện thoại: {customer.phoneNumber || 'N/A'}</div>
                        <div>Email: {customer.email || 'N/A'}</div>
                      </div>
                    );
                  }
                  
                  // Nếu không có customerId, kiểm tra guestInfo trong booking
                  const guestInfo = (detailItem.bookingId as any)?.guestInfo;
                  if (guestInfo) {
                    return (
                      <div>
                        <div>Tên: {guestInfo.fullName || 'Chưa có tên'}</div>
                        <div>Số CMND/CCCD: {guestInfo.idNumber || 'N/A'}</div>
                        <div>Tuổi: {guestInfo.age || 'N/A'}</div>
                        <div>Điện thoại: {guestInfo.phoneNumber || 'N/A'}</div>
                        
                      </div>
                    );
                  }
                  
                  // Kiểm tra thông tin trực tiếp từ service booking
                  if (detailItem.guestName || detailItem.phoneNumber) {
                    return (
                      <div>
                        <div>Tên: {detailItem.guestName || 'Chưa có tên'}</div>
                        <div>Điện thoại: {detailItem.phoneNumber || 'N/A'}</div>
                      </div>
                    );
                  }
                  
                  // Nếu không có thông tin nào
                  return 'Không có thông tin khách hàng';
                })()}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="Ngày tạo">
              {detailItem.createdAt ? new Date(detailItem.createdAt).toLocaleString("vi-VN") : "-"}
            </Descriptions.Item>
            
            <Descriptions.Item label="Cập nhật lần cuối">
              {detailItem.updatedAt ? new Date(detailItem.updatedAt).toLocaleString("vi-VN") : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
