import { Table, Typography, message, Button } from "antd";
import { useEffect, useState } from "react";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import BookingForm from "../../components/BookingStatus/BookingStatusForm";
import type { Booking } from "../../types/booking";
import { fetchBookings, deleteBooking } from "../../services/bookingStatus.service";
import { env } from "../../constanst/getEnvs";
import { bookingColumns } from "../../components/BookingStatus/BookingStatusColumns";

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const loadBookings = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchBookings(page, limit);
      const bookingsData = Array.isArray(res.data) ? res.data : [];
      setBookings(bookingsData);
      setPagination({
        current: res.pagination?.page || 1,
        pageSize: res.pagination?.limit || 10,
        total: res.pagination?.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách đặt phòng");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);
      message.success("Đã xóa đặt phòng thành công");
      loadBookings(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Xóa đặt phòng thất bại");
    }
  };

  const handleSave = async (values: Partial<Booking>) => {
    try {
      const url = editingBooking
        ? `${env.API_URL}/api/v1/bookingStatus/${editingBooking._id}`
        : `${env.API_URL}/api/v1/bookingStatus`;

      const method = editingBooking ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Có lỗi xảy ra");
      }

      message.success(editingBooking ? "Cập nhật thành công" : "Tạo đặt phòng thành công");
      setOpenForm(false);
      loadBookings(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error("Error saving booking:", error);
      message.error(error.message || "Có lỗi xảy ra khi lưu đặt phòng");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4}>
          <CalendarOutlined /> Quản lý đặt phòng
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBooking(null);
            setOpenForm(true);
          }}
        >
          Thêm đặt phòng
        </Button>
      </div>

      <Table
        columns={bookingColumns(
          (record) => {
            setEditingBooking(record);
            setOpenForm(true);
          },
          handleDelete
        )}
        dataSource={bookings}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đặt phòng`,
        }}
        onChange={(p) => loadBookings(p.current, p.pageSize)}
        bordered
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có dữ liệu đặt phòng" }}
      />

      <BookingForm
        open={openForm}
        booking={editingBooking}
        onCancel={() => {
          setOpenForm(false);
          setEditingBooking(null);
        }}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}

