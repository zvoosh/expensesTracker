import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  Form,
  Select,
  Col,
  Row,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Incomes = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const columns = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val) => {
        return <div className="tag tag-food">{val}</div>;
      },
    },
    { title: "Amount (€)", dataIndex: "amount", key: "amount" },
    {
      title: "Actions",
      dateIndex: "actions",
      key: "actions",
      render: () => (
        <Space size="middle">
          <Button type="primary" style={{ backgroundColor: "green" }}>
            Edit
          </Button>
          <Button type="primary" style={{ backgroundColor: "red" }}>
            X
          </Button>
        </Space>
      ),
    },
  ];

  const data = [];

  return (
    <div
      className={`page-containter transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold">Incomes</h2>
      <div className="text-gray-400 text-xs !pl-1 !pb-3 !pt-5">
        create a new income
      </div>
      <Form form={form} layout="inline" className="form-inline !pb-3">
        <Row gutter={0}>
          <Col span={6}>
            <Form.Item name="description">
              <Input placeholder="Description.." style={{ width: 250 }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="category">
              <Select
                style={{ width: 250 }}
                placeholder="Select a category.."
                options={[
                  { value: "salary", label: <span>Salary</span> },
                  { value: "freelance", label: <span>Freelance</span> },
                  { value: "other", label: <span>Other</span> },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="amount">
              <Input
                type="number"
                placeholder="Amount.."
                style={{ width: 250 }}
                inputMode="numeric"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="date">
              <DatePicker style={{ width: 250 }} placeholder="Select date.." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Income
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, position: "bottomRight" }}
      />
    </div>
  );
};

export default Incomes;
