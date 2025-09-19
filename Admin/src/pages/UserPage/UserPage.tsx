import { useEffect, useState } from "react";
import { Table, Tag, Space, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined, CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import UserForm from "../../components/User/UserForm";
import type { User } from "../../types/user";
import { fetchUsers, deleteUser } from "../../services/user.service"; 
import { env } from "../../constanst/getEnvs"; 

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns: ColumnsType<User> = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "geekblue"}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          icon={status === "active" ? <CheckCircleOutlined /> : <StopOutlined />}
          color={status === "active" ? "success" : "error"}
        >
          {status === "active" ? "Đang hoạt động" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setEditingUser(record);
              setOpenForm(true);
            }}
          >
            Chỉnh sửa
          </a>
          <a onClick={() => handleDelete(record._id)}>Xóa</a>
        </Space>
      ),
    },
  ];

  const loadUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const res = await fetchUsers(page, limit); 
      setUsers(res.data.users);
      setPagination({
        current: res.data.pagination.page,
        pageSize: res.data.pagination.limit,
        total: res.data.pagination.totalRecord,
      });
    } catch (e) {
      message.error("Không tải được dữ liệu người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success(`Đã xóa user ${id}`);
      loadUsers(pagination.current, pagination.pageSize);
    } catch {
      message.error("Lỗi khi xóa user");
    }
  };

  const handleSave = async (values: Partial<User>) => {
    try {
      console.log("Payload FE gửi lên:", values);
  
      if (editingUser) {
        // copy ra object mới để loại mấy field BE ko cho update
        const data: any = { ...values };
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        if (!data.password) delete data.password;
  
        const res = await fetch(`${env.API_URL}/api/v1/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        if (!res.ok) {
          const text = await res.text();
          console.error("Lỗi server:", text);
          throw new Error(text);
        }
  
        message.success("Cập nhật thành công");
      }
  
      setOpenForm(false);
      loadUsers(pagination.current, pagination.pageSize);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      message.error("Lỗi khi lưu");
    }
  };
  

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>
        <UserOutlined /> Quản lý người dùng
      </Typography.Title>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={(p) => loadUsers(p.current, p.pageSize)}
        bordered
      />

      <UserForm
        open={openForm}
        user={editingUser}
        onCancel={() => setOpenForm(false)}
        onSave={handleSave}
      />
    </div>
  );
}
