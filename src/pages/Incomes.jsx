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
  message,
} from "antd";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router";

const Incomes = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("cashFlow"))
      ? JSON.parse(localStorage.getItem("cashFlow")).filter(
          (item) => item.type === "income"
        ) || []
      : []
  );
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 3);
    return () => clearTimeout(timeout);
  }, []);

  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

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
      render: (val) => {
        if (val === "salary") {
          return <div className="tag tag-salary">{val}</div>;
        } else if (val === "business") {
          return <div className="tag tag-business">{val}</div>;
        } else if (val === "extra-income") {
          return <div className="tag tag-extra-income">{val}</div>;
        } else if (val === "loan") {
          return <div className="tag tag-loan">{val}</div>;
        } else if (val === "other") {
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
          <Button type="primary" style={{ backgroundColor: "green" }}>
            Edit
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
                      (item) => item.type === "income"
                    ) || []
                  : []
              );
              success("Income removed");
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
      type: "income",
    };
    const cashFlow = JSON.parse(localStorage.getItem("cashFlow")) || [];
    cashFlow.push(formated);
    localStorage.setItem("cashFlow", JSON.stringify(cashFlow));
    setData(
      JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).filter(
            (item) => item.type === "income"
          ) || []
        : []
    );
    success("Income added");
    form.resetFields();
  };

  return (
    <div
      className={`page-containter transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold select-none">
        <Link to={-1} className="!text-black">
          <LeftOutlined className="!mr-5 text-2xl cursor-pointer select-none" />
        </Link>
        Incomes
      </h2>
      <div className="text-gray-400 text-xs !pl-1 !pb-3 !pt-5">
        create a new income
      </div>
      {contextHolder}
      <Form
        form={form}
        layout="inline"
        className="form-inline !pb-3"
        onFinish={onFinish}
      >
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
                  { value: "business", label: <span>Business</span> },
                  { value: "extra-income", label: <span>Extra Income</span> },
                  { value: "loan", label: <span>Loan</span> },
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
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Income
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey={(record) => `${record.index}-${record.date}`}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, position: "bottomRight" }}
      />
    </div>
  );
};

export default Incomes;
