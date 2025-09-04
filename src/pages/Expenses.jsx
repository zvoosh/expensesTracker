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
  message,
  Divider,
} from "antd";
import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FallOutlined,
  PlusOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../utils/hooks";
import { categoryTag } from "../utils";

const { Search } = Input;

const Expenses = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("cashFlow"))
      ? JSON.parse(localStorage.getItem("cashFlow")).filter(
          (item) => item.type === "expense"
        ) || []
      : []
  );

  useEffect(() => {
    setVisible(true);
  }, []);

  const onSearch = (searchValue) => {
    const val = searchValue.trim().toLowerCase();

    const fullData = JSON.parse(localStorage.getItem("cashFlow")) || [];
    const incomeData = fullData.filter((item) => item.type === "expense");

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
        const utc_days = Math.floor(val - 25569);
        const utc_value = utc_days * 86400;
        const date = dayjs(utc_value * 1000).format("DD/MM/YYYY");
        return <div>{date}</div>;
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
                      (item) => item.type === "expense"
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
      type: "expense",
    };
    const cashFlow = JSON.parse(localStorage.getItem("cashFlow")) || [];
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
      {contextHolder}
      <h1 className="text-3xl font-bold !mb-5 select-none w-full flex justify-between items-center">
        Expenses
        <div>
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
        </div>
      </h1>
      <Search
        placeholder="Search something..."
        onSearch={onSearch}
        enterButton
        allowClear
        style={{ width: 300 }}
        className="!mt-5"
      />
      <Table
        rowKey={(record) => `${record.index}-${record.date}`}
        className="!mt-5 hidden lg:block"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, position: "bottomRight" }}
        scroll={{ x: 1000 }}
      />
      <div className="!mt-5 block lg:hidden">
        <Row>
          <Divider />
          <Col span={24}>
            <div className="flex justify-between">
              <div className="w-1/5 text-base text-center">Description</div>
              <div className="w-1/5 text-base text-center">Category</div>
              <div className="w-1/5 text-base text-center">Euros €</div>
            </div>
          </Col>
          <Col span={24}>
            <Divider />
            {data.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-between items-center !mb-1 overflow-x-auto h-20">
                    <div className="w-fit flex h-full">
                      <div
                        className={`h-full flex !mr-1 justify-center items-center !p-2 ${
                          isOptionsOpen === index ? "w-fit" : ""
                        }`}
                      >
                        <div>
                          {isOptionsOpen === index && (
                            <div className="flex !mr-3">
                              <div className="!mx-3">
                                <DeleteOutlined
                                  className="!scale-120 !text-red-600"
                                  onClick={() => {
                                    const dataArr =
                                      JSON.parse(
                                        localStorage.getItem("cashFlow")
                                      ) || [];

                                    const updatedArr = dataArr.filter(
                                      (val) => val.index !== item.index
                                    );
                                    localStorage.setItem(
                                      "cashFlow",
                                      JSON.stringify(updatedArr)
                                    );
                                    setData(
                                      JSON.parse(
                                        localStorage.getItem("cashFlow")
                                      )
                                        ? JSON.parse(
                                            localStorage.getItem("cashFlow")
                                          ).filter(
                                            (item) => item.type === "income"
                                          ) || []
                                        : []
                                    );
                                    success("Income removed");
                                    setIsOptionsOpen(false);
                                  }}
                                />
                              </div>
                              <div>
                                <EditOutlined
                                  style={{ color: "#1677ff" }}
                                  className="!scale-120"
                                  onClick={() => {
                                    setIsEditing(true);
                                    const recordWithParsedDate = {
                                      ...item,
                                      date: dayjs(item.date),
                                    };
                                    editForm.setFieldsValue(
                                      recordWithParsedDate
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <CaretRightOutlined
                            onClick={() =>
                              setIsOptionsOpen(
                                index === isOptionsOpen ? null : index
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div
                          className={`text-lg capitalize break-words ${
                            item.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.type == "income" ? (
                            <RiseOutlined className="!mx-1 !mr-2" />
                          ) : (
                            <FallOutlined className="!mx-1 !mr-2" />
                          )}
                          {item.description}
                        </div>
                        <div className="text-gray-500 text-start">
                          {dayjs(item.date).format("DD/MM/YYYY")}
                        </div>
                        <div>{categoryTag(item)}</div>
                      </div>
                    </div>
                    <div className="text-xl flex items-center w-1/5">
                      {formatNumber(item.amount, false)}
                    </div>
                  </div>
                  <Divider />
                </div>
              );
            })}
          </Col>
        </Row>
      </div>
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
                <Input placeholder="Description..." required minLength={3} />
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
                  required
                  min={0}
                  minLength={1}
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
                <Input placeholder="Description..." required minLength={3} />
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

export default Expenses;
