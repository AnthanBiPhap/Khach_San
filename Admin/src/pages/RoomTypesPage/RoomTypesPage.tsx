import { Table, Typography, message, Button } from "antd";
import { useEffect, useState } from "react";
import { AppstoreOutlined, PlusOutlined } from "@ant-design/icons";
import type { RoomType } from "../../types/room";
import { fetchRoomTypes, deleteRoomType } from "../../services/roomTypes.service";
import { env } from "../../constanst/getEnvs";
import { roomTypesColumns } from "../../components/RoomTypes/RoomTypesColumns";
import RoomTypesForm from "../../components/RoomTypes/RoomTypesForm";

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<RoomType | null>(null);

  const load = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchRoomTypes(page, limit);
      const list = Array.isArray(res.data) ? res.data : [];
      setRoomTypes(list);
      setPagination({
        current: res.pagination?.page || 1,
        pageSize: res.pagination?.limit || 10,
        total: res.pagination?.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách loại phòng");
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteRoomType(id);
      message.success("Đã xóa loại phòng thành công");
      load(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Xóa loại phòng thất bại");
    }
  };

  const handleSave = async (values: Partial<RoomType>) => {
    try {
      const url = editing
        ? `${env.API_URL}/api/v1/roomTypes/${editing._id}`
        : `${env.API_URL}/api/v1/roomTypes`;

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

      message.success(editing ? "Cập nhật loại phòng thành công" : "Tạo loại phòng thành công");
      setOpenForm(false);
      setEditing(null);
      load(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error("Error saving room type:", error);
      message.error(error.message || "Có lỗi xảy ra khi lưu loại phòng");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4}>
          <AppstoreOutlined /> Quản lý loại phòng
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          Thêm loại phòng
        </Button>
      </div>

      <Table
        columns={roomTypesColumns(
          (record) => {
            setEditing(record);
            setOpenForm(true);
          },
          handleDelete
        )}
        dataSource={roomTypes}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} loại phòng`,
        }}
        onChange={(p) => load(p.current, p.pageSize)}
        bordered
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có dữ liệu loại phòng" }}
      />

      <RoomTypesForm
        open={openForm}
        roomType={editing}
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
