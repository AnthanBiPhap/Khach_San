import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import type { ReviewItem, ReviewStatus, ReviewTargetType } from "../../types/review";
import axios from "axios";

const { TextArea } = Input;

interface SimpleRef { _id: string; name?: string; fullName?: string }

interface ReviewsFormProps {
  open: boolean;
  item?: ReviewItem | null;
  onCancel: () => void;
  onSave: (values: Partial<ReviewItem>) => Promise<void>;
  loading?: boolean;
}

export default function ReviewsForm({ open, item, onCancel, onSave, loading }: ReviewsFormProps) {
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState<SimpleRef[]>([]);
  const [services, setServices] = useState<SimpleRef[]>([]);
  const [locations, setLocations] = useState<SimpleRef[]>([]);
  const [users, setUsers] = useState<SimpleRef[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try { const res = await axios.get("http://localhost:8080/api/v1/rooms"); setRooms(res.data?.data?.rooms || []); } catch {}
    };
    const fetchServices = async () => {
      try { const res = await axios.get("http://localhost:8080/api/v1/services"); const arr = res.data?.data?.data || res.data?.data?.services || []; setServices(arr); } catch {}
    };
    const fetchLocations = async () => {
      try { const res = await axios.get("http://localhost:8080/api/v1/locations"); setLocations(res.data?.data?.locations || []); } catch {}
    };
    const fetchUsers = async () => {
      try { const res = await axios.get("http://localhost:8080/api/v1/users"); setUsers(res.data?.data?.users || []); } catch {}
    };

    fetchRooms();
    fetchServices();
    fetchLocations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        reviewerId: item.reviewerId?._id,
        targetType: item.targetType,
        targetId: item.targetId,
        rating: item.rating,
        comment: item.comment,
        status: item.status,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      reviewerId: values.reviewerId,
      targetType: values.targetType as ReviewTargetType,
      targetId: values.targetId,
      rating: values.rating,
      comment: values.comment,
      status: values.status as ReviewStatus,
    });
  };

  return (
    <Modal
      open={open}
      title={item ? "Chỉnh sửa đánh giá" : "Tạo đánh giá"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="reviewerId" label="Người đánh giá" rules={[{ required: true, message: "Chọn người đánh giá" }]}>
          <Select
            showSearch
            placeholder="Chọn người đánh giá"
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={users.map(u => ({ label: u.fullName || u._id, value: u._id }))}
          />
        </Form.Item>

        <Form.Item name="targetType" label="Loại đối tượng" rules={[{ required: true, message: "Chọn loại đối tượng" }]}>
          <Select options={[{value: 'room', label: 'room'}, {value: 'service', label: 'service'}, {value: 'location', label: 'location'}]} />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const type = form.getFieldValue('targetType');
            const options = type === 'room' ? rooms.map(r => ({label: r.name || r._id, value: r._id}))
              : type === 'service' ? services.map(s => ({label: s.name || s._id, value: s._id}))
              : locations.map(l => ({label: l.name || l._id, value: l._id}));
            return (
              <Form.Item name="targetId" label="Đối tượng" rules={[{ required: true, message: "Chọn đối tượng" }]}> 
                <Select showSearch placeholder="Chọn đối tượng" options={options} />
              </Form.Item>
            )
          }}
        </Form.Item>

        <Form.Item name="rating" label="Số sao" rules={[{ required: true, message: "Nhập số sao 1-5" }]}>
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="comment" label="Bình luận">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select options={[{value:'active',label:'Hiện'}, {value:'hidden',label:'Ẩn'}, {value:'deleted',label:'Xóa'}]} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
