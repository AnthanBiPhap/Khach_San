import { Table, Typography, message, Button } from "antd";
import { useEffect, useState } from "react";
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
          handleDelete
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
    </div>
  );
}
