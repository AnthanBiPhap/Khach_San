import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import type { InvoiceItemEntry } from "../../types/invoiceItem";

const { Option } = Select;

interface SimpleInvoice { _id: string; totalAmount?: number; status?: string }

interface InvoiceItemsFormProps {
  open: boolean;
  item?: InvoiceItemEntry | null;
  onCancel: () => void;
  onSave: (values: Partial<InvoiceItemEntry>) => Promise<void>;
  loading?: boolean;
}

export default function InvoiceItemsForm({ open, item, onCancel, onSave, loading }: InvoiceItemsFormProps) {
  const [form] = Form.useForm();
  const [invoices, setInvoices] = useState<SimpleInvoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoadingInvoices(true);
        const res = await axios.get("http://localhost:8080/api/v1/invoices");
        setInvoices(res.data?.data?.invoices || []);
      } catch {
        message.error("Không tải được danh sách hóa đơn");
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        invoiceId: item.invoiceId?._id,
        itemType: item.itemType,
        description: item.description,
        amount: item.amount,
      });
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSave({
      invoiceId: values.invoiceId,
      itemType: values.itemType,
      description: values.description,
      amount: values.amount,
    } as Partial<InvoiceItemEntry>);
  };

  return (
    <Modal
      open={open}
      title={item ? "Chỉnh sửa mục hóa đơn" : "Thêm mục hóa đơn"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="invoiceId" label="Hóa đơn" rules={[{ required: true, message: "Chọn hóa đơn" }]}>
          <Select
            showSearch
            placeholder="Chọn hóa đơn"
            loading={loadingInvoices}
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
            options={invoices.map(inv => ({ label: `${inv._id?.slice(0,8)}... - ${new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(inv.totalAmount || 0)} (${inv.status})`, value: inv._id }))}
          />
        </Form.Item>

        <Form.Item name="itemType" label="Loại" rules={[{ required: true, message: "Chọn loại mục" }]}>
          <Select>
            <Option value="room">Phòng</Option>
            <Option value="service">Dịch vụ</Option>
            <Option value="late_fee">Phí trễ</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="amount" label="Số tiền" rules={[{ required: true, message: "Nhập số tiền" }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
