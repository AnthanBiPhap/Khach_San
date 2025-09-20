import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import type { RoomType } from "../../types/room";

const { TextArea } = Input;

interface RoomTypesFormProps {
  open: boolean;
  roomType?: RoomType | null;
  onCancel: () => void;
  onSave: (values: Partial<RoomType>) => Promise<void>;
  loading?: boolean;
}

export default function RoomTypesForm({ open, roomType, onCancel, onSave, loading }: RoomTypesFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (roomType) {
      form.setFieldsValue({
        name: roomType.name,
        description: roomType.description,
        pricePerNight: roomType.pricePerNight,
        capacity: roomType.capacity,
        amenities: roomType.amenities || [],
        images: roomType.images || [],
      });
    } else {
      form.resetFields();
    }
  }, [roomType, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      name: values.name,
      description: values.description,
      pricePerNight: values.pricePerNight,
      capacity: values.capacity,
      amenities: values.amenities,
      images: values.images,
    });
  };

  return (
    <Modal
      open={open}
      title={roomType ? "Chỉnh sửa loại phòng" : "Tạo loại phòng mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên loại phòng" rules={[{ required: true, message: "Nhập tên loại phòng" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="pricePerNight" label="Giá/đêm" rules={[{ required: true, message: "Nhập giá/đêm" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true, message: "Nhập sức chứa" }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="amenities" label="Tiện nghi">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập tiện nghi, nhấn Enter" />
        </Form.Item>

        <Form.Item name="images" label="Ảnh (URL)">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập URL ảnh, nhấn Enter" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
