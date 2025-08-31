import { useEffect, useState } from "react";
import dayjs from "dayjs";
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
  Modal,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const Expenses = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("cashFlow"))
      ? JSON.parse(localStorage.getItem("cashFlow")).filter(
          (item) => item.type === "expense"
        ) || []
      : []
  );

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 3);
    return () => clearTimeout(timeout);
  }, []);

  const columns = [
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val) => {
        return <div>{dayjs(val).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val, item) => {
        if (item.category === "food") {
          return <div className="tag tag-food">{val}</div>;
        }
        if (item.category === "entertainment") {
          return <div className="tag tag-entertainment">{val}</div>;
        }
        if (item.category === "household") {
          return <div className="tag tag-household">{val}</div>;
        }
        if (item.category === "transport") {
          return <div className="tag tag-transport">{val}</div>;
        }
        if (item.category === "other") {
          return <div className="tag tag-other">{val}</div>;
        }
      },
    },
    { title: "Amount (€)", dataIndex: "amount", key: "amount" },
    {
      title: "Actions",
      dateIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setIsEditing(true);
              const recordWithParsedDate = {
                ...record,
                date: dayjs(record.date),
              };
              editForm.setFieldsValue(recordWithParsedDate);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "red" }}
            onClick={() => {
              const dataArr =
                JSON.parse(localStorage.getItem("cashFlow")) || [];

              const updatedArr = dataArr.filter(
                (item) => item.index !== record.index
              );
              localStorage.setItem("cashFlow", JSON.stringify(updatedArr));
              setData(
                JSON.parse(localStorage.getItem("cashFlow"))
                  ? JSON.parse(localStorage.getItem("cashFlow")).filter(
                      (item) => item.type === "expense"
                    ) || []
                  : []
              );
            }}
          >
            X
          </Button>
        </Space>
      ),
    },
  ];
  const onFinish = (values) => {
    const formated = {
      index: JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).length
        : 0,
      description: values.description,
      amount: values.amount,
      category: values.category,
      date: values.date.format("YYYY-MM-DD HH:mm:ss"),
      type: "expense",
    };
    const cashFlow = JSON.parse(localStorage.getItem("cashFlow")) || [];
    console.log("cashflow", cashFlow);
    cashFlow.push(formated);
    localStorage.setItem("cashFlow", JSON.stringify(cashFlow));
    setData(
      JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).filter(
            (item) => item.type === "expense"
          ) || []
        : []
    );
    form.resetFields();
  };
  const onEdit = (values) => {
    const { date, index } = values;
    values.date = date.format("YYYY-MM-DD HH:mm:ss");
    const cashFlow = JSON.parse(localStorage.getItem("cashFlow")) || [];
    let originalId = cashFlow.findIndex((item) => item.index === index);
    cashFlow[originalId] = values;
    console.log(cashFlow[originalId]);
    console.log(cashFlow);
    localStorage.setItem("cashFlow", JSON.stringify(cashFlow));
    setData(
      JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).filter(
            (item) => item.type === "expense"
          ) || []
        : []
    );
    setIsEditing(false);
    editForm.resetFields();
  };

  return (
    <div
      className={`page-containter !pb-10 transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold !mb-5 select-none w-full flex justify-between items-center">
        Expenses
        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsCreating(true);
          }}
        >
          Add Expense
        </Button>
      </h2>
      <Table
        rowKey={(record) => `${record.index}-${record.date}`}
        className="!mt-5"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, position: "bottomRight" }}
        scroll={{ x: 1000 }}
      />
      <Modal
        title="Edit Expense"
        className="!h-fit"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onEdit}
          className="w-full"
        >
          <Row gutter={[12, 0]} justify={"center"}>
            <Col span={12}>
              <Form.Item name="description" label="Description:">
                <Input placeholder="Description..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Categoy:">
                <Select
                  placeholder="Select a category..."
                  options={[
                    { value: "food", label: "Food" },
                    { value: "entertainment", label: "Entertainment" },
                    { value: "household", label: "Household" },
                    { value: "transport", label: "Transport" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="Amount:">
                <Input type="number" inputMode="numeric" suffix="€" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date:">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24} className="text-right">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Col>
          </Row>

          <Form.Item name="index" className="!hidden">
            <Input />
          </Form.Item>
          <Form.Item name="type" className="!hidden">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Create Expense"
        className="!h-fit !lg:w-1/4 !sm:w-1/2"
        open={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="inline"
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          className="w-full"
        >
          <Row gutter={[24, 24]} justify={"center"} className="!mt-5">
            <Col span={24}>
              <Form.Item name="description" label="Description:">
                <Input placeholder="Description..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="category" label="Category:">
                <Select
                  placeholder="Select a category..."
                  options={[
                    { value: "food", label: "Food" },
                    { value: "entertainment", label: "Entertainment" },
                    { value: "household", label: "Household" },
                    { value: "transport", label: "Transport" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="amount" label="Amount:">
                <Input type="number" inputMode="numeric" suffix="€" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="date" label="Date:">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24} className="text-right">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Expenses;
