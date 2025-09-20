import { Form, Input, Modal, Select, InputNumber } from "antd";
import { useEffect } from "react";
import type { LocationItem, LocationStatus, LocationType } from "../../types/location";

const { TextArea } = Input;

interface LocationsFormProps {
  open: boolean;
  item?: LocationItem | null;
  onCancel: () => void;
  onSave: (values: Partial<LocationItem>) => Promise<void>;
  loading?: boolean;
}

const LOCATION_TYPES: LocationType[] = [
  "tham_quan",
  "an_uong",
  "the_thao",
  "phim_anh",
  "sach",
  "game",
  "du_lich",
  "thu_gian",
  "bao_tang",
  "vuon_quoc_gia",
];

export default function LocationsForm({ open, item, onCancel, onSave, loading }: LocationsFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        type: item.type,
        description: item.description,
        address: item.address,
        images: item.images || [],
        ratingAvg: item.ratingAvg,
        status: item.status,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      name: values.name,
      type: values.type,
      description: values.description,
      address: values.address,
      images: values.images,
      ratingAvg: values.ratingAvg,
      status: values.status as LocationStatus,
    });
  };

  return (
    <Modal
      open={open}
      title={item ? "Chỉnh sửa địa điểm" : "Tạo địa điểm mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên địa điểm" rules={[{ required: true, message: "Nhập tên địa điểm" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Loại địa điểm" rules={[{ required: true, message: "Chọn loại địa điểm" }]}>
          <Select options={LOCATION_TYPES.map(t => ({ label: t, value: t }))} />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="images" label="Ảnh (URL)">
          <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập URL ảnh, nhấn Enter" />
        </Form.Item>

        <Form.Item name="ratingAvg" label="Điểm đánh giá" rules={[{ type: "number", min: 0, max: 5 }]}>
          <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="hidden">Ẩn</Select.Option>
            <Select.Option value="deleted">Xóa</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
