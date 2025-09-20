import { Table, Typography, message, Button } from "antd";
import { useEffect, useState } from "react";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import type { InvoiceItemEntry } from "../../types/invoiceItem";
import { fetchInvoiceItems, deleteInvoiceItem } from "../../services/invoiceItems.service";
import { env } from "../../constanst/getEnvs";
import { invoiceItemsColumns } from "../../components/InvoiceItems/InvoiceItemsColumns";
import InvoiceItemsForm from "../../components/InvoiceItems/InvoiceItemsForm";

export default function InvoiceItemsPage() {
  const [items, setItems] = useState<InvoiceItemEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<InvoiceItemEntry | null>(null);

  const load = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchInvoiceItems(page, limit);
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list);
      setPagination({
        current: res.pagination?.page || 1,
        pageSize: res.pagination?.limit || 10,
        total: res.pagination?.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách mục hóa đơn");
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
      await deleteInvoiceItem(id);
      message.success("Đã xóa mục hóa đơn thành công");
      load(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
      message.error("Xóa mục hóa đơn thất bại");
    }
  };

  const handleSave = async (values: Partial<InvoiceItemEntry>) => {
    try {
      const url = editing
        ? `${env.API_URL}/api/v1/invoiceItems/${editing._id}`
        : `${env.API_URL}/api/v1/invoiceItems`;

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

      message.success(editing ? "Cập nhật mục hóa đơn thành công" : "Thêm mục hóa đơn thành công");
      setOpenForm(false);
      setEditing(null);
      load(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error("Error saving invoice item:", error);
      message.error(error.message || "Có lỗi xảy ra khi lưu mục hóa đơn");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4}>
          <FileTextOutlined /> Quản lý mục hóa đơn
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
        >
          Thêm mục
        </Button>
      </div>

      <Table
        columns={invoiceItemsColumns(
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
          showTotal: (total) => `Tổng ${total} mục`,
        }}
        onChange={(p) => load(p.current, p.pageSize)}
        bordered
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có dữ liệu mục hóa đơn" }}
      />

      <InvoiceItemsForm
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
