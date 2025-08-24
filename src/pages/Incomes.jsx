import React from "react";
import { Table, Button, Input, DatePicker, Form, Select, Col, Row, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Incomes = () => {
  const [form] = Form.useForm();

  const columns = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val, item) => {
        return <div className="tag tag-food">{val}</div>;
      },
    },
    { title: "Amount (€)", dataIndex: "amount", key: "amount" },
    {
      title: "Actions",
      dateIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" style={{backgroundColor: "green"}}>Edit</Button>
          <Button type="primary" style={{backgroundColor: "red"}}>X</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      description: "Joe Black",
      category: "food",
      amount: 100,
      date: "2020-03-12",
    },
  ];

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold">Incomes</h2>
      <Form form={form} layout="inline" className="form-inline">
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
                  { value: "Food", label: <span>Food</span> },
                  { value: "Entertainment", label: <span>Entertainment</span> },
                  { value: "Household", label: <span>Household</span> },
                  { value: "Other", label: <span>Other</span> },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="cost">
              <Input
                type="number"
                placeholder="Cost.."
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
