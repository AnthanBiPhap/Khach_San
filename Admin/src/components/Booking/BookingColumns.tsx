import { Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Booking } from "../../types/booking";

export const bookingColumns = (
  handleEdit: (record: Booking) => void,
  handleDelete: (id: string) => void
): ColumnsType<Booking> => [
//   {
//     title: "Mã đặt phòng",
//     dataIndex: "_id",
//     key: "_id",
//     render: (id) => <span>{id.substring(0, 8)}...</span>,
//   },
  {
    title: "Khách hàng",
    key: "customer",
    render: (_, record) => (
      <div>
        <div>{record.customerId?.fullName}</div>
        <div style={{ color: "#888", fontSize: "12px" }}>
          {record.customerId?.phoneNumber}
        </div>
      </div>
    ),
  },
  {
    title: "Phòng",
    key: "room",
    render: (_, record) => `Phòng ${record.roomId?.roomNumber}`,
  },
  {
    title: "Ngày nhận/trả",
    key: "dates",
    render: (_, record) => (
      <div>
        <div>Nhận: {new Date(record.checkIn).toLocaleString("vi-VN")}</div>
        <div>Trả: {new Date(record.checkOut).toLocaleString("vi-VN")}</div>
      </div>
    ),
  },
  {
    title: "Số khách",
    dataIndex: "guests",
    key: "guests",
    align: "center",
  },
  {
    title: "Tổng tiền",
    key: "totalPrice",
    render: (_, record) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(record.totalPrice),
  },
  {
    title: "Thanh toán",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    render: (status) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        pending: { color: "orange", text: "Chờ thanh toán" },
        paid: { color: "green", text: "Đã thanh toán" },
        refunded: { color: "blue", text: "Đã hoàn tiền" },
        failed: { color: "red", text: "Thất bại" },
      };
      const { color, text } = statusMap[status] || {
        color: "default",
        text: status,
      };
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <Space>
        <a onClick={() => handleEdit(record)}>Chỉnh sửa</a>
        <a onClick={() => handleDelete(record._id)}>Xóa</a>
      </Space>
    ),
  },
];
