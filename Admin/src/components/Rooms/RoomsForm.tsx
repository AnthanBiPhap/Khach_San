import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Room, RoomType } from "../../types/room";

const { Option } = Select;

interface RoomsFormProps {
  open: boolean;
  room?: Room | null;
  onCancel: () => void;
  onSave: (values: Partial<Room>) => Promise<void>;
  loading?: boolean;
}

export default function RoomsForm({ open, room, onCancel, onSave, loading }: RoomsFormProps) {
  const [form] = Form.useForm();
  const [types, setTypes] = useState<RoomType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoadingTypes(true);
        const res = await axios.get("http://localhost:8080/api/v1/roomTypes");
        setTypes(res.data?.data?.roomTypes || []);
      } catch {
        message.error("Không tải được danh sách loại phòng");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (room) {
      form.setFieldsValue({
        roomNumber: room.roomNumber,
        typeId: room.typeId?._id,
        status: room.status,
        amenities: room.amenities || [],
      });
    } else {
      form.resetFields();
    }
  }, [room, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        roomNumber: values.roomNumber,
        typeId: values.typeId,
        status: values.status,
        amenities: values.amenities,
      });
    } catch (error) {
      console.error(error);
      message.error("Vui lòng điền đủ thông tin");
    }
  };

  return (
    <Modal
      open={open}
      title={room ? "Chỉnh sửa phòng" : "Tạo phòng mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="roomNumber" label="Số phòng" rules={[{ required: true, message: "Nhập số phòng" }]}>
          <Input placeholder="VD: 101A" />
        </Form.Item>

        <Form.Item name="typeId" label="Loại phòng">
          <Select
            showSearch
            allowClear
            placeholder="Chọn loại phòng"
            loading={loadingTypes}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={types.map((t) => ({ label: `${t.name} - ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(t.pricePerNight)}`, value: t._id }))}
          />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select placeholder="Chọn trạng thái">
            <Option value="available">Sẵn sàng</Option>
            <Option value="occupied">Đang ở</Option>
            <Option value="maintenance">Bảo trì</Option>
            <Option value="unavailable">Không khả dụng</Option>
          </Select>
        </Form.Item>

        <Form.Item name="amenities" label="Tiện nghi">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập tiện nghi, nhấn Enter">
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
