import { Table, Typography, message, Button } from "antd";
import { useEffect, useState } from "react";
import { StarOutlined, PlusOutlined } from "@ant-design/icons";
import type { ReviewItem } from "../../types/review";
import { fetchReviews, deleteReview } from "../../services/reviews.service";
import { env } from "../../constanst/getEnvs";
import { reviewsColumns } from "../../components/Reviews/ReviewsColumns";
import ReviewsForm from "../../components/Reviews/ReviewsForm";

export default function ReviewsPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ReviewItem | null>(null);

  const load = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchReviews(page, limit);
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list);
      setPagination({
        current: res.pagination?.page || 1,
        pageSize: res.pagination?.limit || 10,
        total: res.pagination?.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách đánh giá");
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
      await deleteReview(id);
      message.success("Đã xóa đánh giá thành công");
      load(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Xóa đánh giá thất bại");
    }
  };

  const handleSave = async (values: Partial<ReviewItem>) => {
    try {
      const url = editing
        ? `${env.API_URL}/api/v1/reviews/${editing._id}`
        : `${env.API_URL}/api/v1/reviews`;

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

      message.success(editing ? "Cập nhật đánh giá thành công" : "Tạo đánh giá thành công");
      setOpenForm(false);
      setEditing(null);
      load(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error("Error saving review:", error);
      message.error(error.message || "Có lỗi xảy ra khi lưu đánh giá");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4}>
          <StarOutlined /> Quản lý đánh giá
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          Thêm đánh giá
        </Button>
      </div>

      <Table
        columns={reviewsColumns(
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
          showTotal: (total) => `Tổng ${total} đánh giá`,
        }}
        onChange={(p) => load(p.current, p.pageSize)}
        bordered
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có dữ liệu đánh giá" }}
      />

      <ReviewsForm
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
