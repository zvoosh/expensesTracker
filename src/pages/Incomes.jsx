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
  Modal,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { formatNumber } from "../hooks";

const { Search } = Input;

const Incomes = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).filter(
            (item) => item.type === "income"
          )
        : []
    );
    setVisible(true);
  }, []);

  const onSearch = (searchValue) => {
    const val = searchValue.trim().toLowerCase();

    const fullData = JSON.parse(localStorage.getItem("cashFlow")) || [];
    const incomeData = fullData.filter((item) => item.type === "income");

    if (!val) {
      setData(incomeData);
      return;
    }

    const result = incomeData.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (!value) return false;

        if (key.toLowerCase().includes("date")) {
          const formatted = dayjs(value).format("DD/MM/YYYY");
          return formatted.toLowerCase().includes(val);
        }

        return String(value).toLowerCase().includes(val);
      })
    );

    setData(result);
  };

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
    {
      title: "Amount (€)",
      dataIndex: "amount",
      key: "amount",
      render: (item) => <div>{formatNumber(item)}</div>,
    },
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
    setIsCreating(false);
  };
  const onEdit = (values) => {
    const { date, index } = values;
    values.date = date.format("YYYY-MM-DD HH:mm:ss");
    const cashFlow = JSON.parse(localStorage.getItem("cashFlow")) || [];
    let originalId = cashFlow.findIndex((item) => item.index === index);
    cashFlow[originalId] = values;
    localStorage.setItem("cashFlow", JSON.stringify(cashFlow));
    setData(
      JSON.parse(localStorage.getItem("cashFlow"))
        ? JSON.parse(localStorage.getItem("cashFlow")).filter(
            (item) => item.type === "income"
          ) || []
        : []
    );
    setIsEditing(false);
    editForm.resetFields();
  };
  return (
    <div
      className={`page-containter transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold select-none w-full flex justify-between items-center">
        Incomes
        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsCreating(true);
          }}
        >
          Add Income
        </Button>
      </h2>
      <Search
        placeholder="Search something..."
        onSearch={onSearch}
        enterButton
        allowClear
        style={{ width: 300 }}
        className="!mt-5"
      />
      {contextHolder}
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
                <Input placeholder="Description..." minLength={3} required />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Categoy:">
                <Select
                  className="[&_.ant-select-selector]:!p-2"
                  flex="1 1 250px"
                  style={{ width: "100%" }}
                  placeholder="Select a category.."
                  options={[
                    { value: "salary", label: <span>Salary</span> },
                    { value: "business", label: <span>Business</span> },
                    { value: "extra-income", label: <span>Extra Income</span> },
                    { value: "loan", label: <span>Loan</span> },
                    { value: "other", label: <span>Other</span> },
                  ]}
                  aria-required
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="Amount:">
                <Input
                  type="number"
                  inputMode="numeric"
                  suffix="€"
                  minLength={1}
                  min={0}
                  required
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date:">
                <DatePicker style={{ width: "100%" }} required />
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
        title="Create Income"
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
                <Input placeholder="Description..." required minLength={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="category" label="Category:">
                <Select
                  className="[&_.ant-select-selector]:!p-2"
                  flex="1 1 250px"
                  style={{ width: "100%" }}
                  placeholder="Select a category.."
                  options={[
                    { value: "salary", label: <span>Salary</span> },
                    { value: "business", label: <span>Business</span> },
                    { value: "extra-income", label: <span>Extra Income</span> },
                    { value: "loan", label: <span>Loan</span> },
                    { value: "other", label: <span>Other</span> },
                  ]}
                  aria-required
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="amount" label="Amount:">
                <Input
                  type="number"
                  inputMode="numeric"
                  suffix="€"
                  required
                  min={0}
                  minLength={1}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="date" label="Date:">
                <DatePicker style={{ width: "100%" }} required />
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

export default Incomes;
