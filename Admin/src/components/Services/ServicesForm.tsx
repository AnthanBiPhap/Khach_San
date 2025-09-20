import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import type { ServiceItem } from "../../types/service";

const { TextArea } = Input;

interface ServicesFormProps {
  open: boolean;
  service?: ServiceItem | null;
  onCancel: () => void;
  onSave: (values: Partial<ServiceItem>) => Promise<void>;
  loading?: boolean;
}

export default function ServicesForm({ open, service, onCancel, onSave, loading }: ServicesFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        slots: service.slots || [],
        images: service.images || [],
        status: service.status,
      });
    } else {
      form.resetFields();
    }
  }, [service, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      name: values.name,
      description: values.description,
      basePrice: values.basePrice,
      slots: values.slots,
      images: values.images,
      status: values.status,
    });
  };

  return (
    <Modal
      open={open}
      title={service ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true, message: "Nhập tên dịch vụ" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="basePrice" label="Giá cơ bản" rules={[{ required: true, message: "Nhập giá cơ bản" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="slots" label="Khung giờ">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập khung giờ, ví dụ 09:00, 11:00" />
        </Form.Item>

        <Form.Item name="images" label="Ảnh (URL)">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập URL ảnh, nhấn Enter" />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select>
            <Select.Option value="active">Đang bán</Select.Option>
            <Select.Option value="hidden">Ẩn</Select.Option>
            <Select.Option value="deleted">Đã xóa</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
