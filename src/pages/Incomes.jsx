import { useContext, useEffect, useMemo, useState } from "react";
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
import dayjs from "dayjs";
import { formatNumber, getIncomes } from "../utils/hooks";
import { categoryTag, DataContext } from "../utils";

const { Search } = Input;

const Incomes = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const { data, setData } = useContext(DataContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setVisible(true);
  }, []);

  const filteredData = useMemo(() => {
    const incomes = getIncomes();
    if (!searchTerm) return incomes;
    return incomes.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (!value) return false;

        if (key.toLowerCase().includes("date")) {
          const formatted = dayjs(value).format("DD/MM/YYYY");
          return formatted.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm]);

  const onSearch = (searchValue) => {
    const val = searchValue.trim().toLowerCase();

    setSearchTerm(val);
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
        const date = dayjs(val).format("DD/MM/YYYY");
        return <div>{date}</div>;
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
    setData(cashFlow);
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
    setData(cashFlow);
    success("Income edited");
    setIsEditing(false);
    editForm.resetFields();
  };
  return (
    <>
      <div
        className={`page-containter transition-all duration-700 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-3xl font-bold select-none w-full flex justify-between items-center">
          Incomes
        </h1>
        <Row className="w-full !mt-5 flex justify-between" gutter={[18, 18]}>
          <Col xs={24} sm={24} md={12}>
            <Search
              placeholder="Search something..."
              onSearch={onSearch}
              enterButton
              allowClear
              style={{ width: 300 }}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            className="block md:!flex md:!justify-end"
          >
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
          </Col>
        </Row>
        {contextHolder}
        <Table
          rowKey={(record) => `${record.index}-${record.date}`}
          className="!mt-5 hidden lg:block"
          columns={columns}
          dataSource={filteredData}
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
              {filteredData.map((item, index) => {
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
                            {item.description}
                            {item.type == "income" ? (
                              <RiseOutlined className="!mx-1 !mr-2" />
                            ) : (
                              <FallOutlined className="!mx-1 !mr-2" />
                            )}
                          </div>
                          <div className="text-gray-500 text-start">
                            {dayjs(item.date).format("DD/MM/YYYY")}
                          </div>
                          <div>{categoryTag(item)}</div>
                        </div>
                      </div>
                      <div
                        className={`text-xl flex items-center w-fit ${
                          item.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
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
            layout="horizontal"
            labelCol={{ span: 6 }}
            labelAlign="left"
            onFinish={onEdit}
            className="w-full"
          >
            <Row gutter={[4, 4]} justify={"center"} className="!mt-5">
              <Col span={24}>
                <Form.Item
                  name="description"
                  label={<span className="text-base">Description:</span>}
                  required
                >
                  <Input
                    placeholder="Description..."
                    required
                    minLength={3}
                    className="!p-1"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="category"
                  label={<span className="text-base">Category:</span>}
                  required
                >
                  <Select
                    className="[&_.ant-select-selector]:!p-3 [&_.ant-select-selector]:!pl-1 !flex !items-center"
                    placeholder="Select a category.."
                    options={[
                      { value: "salary", label: <span>Salary</span> },
                      { value: "business", label: <span>Business</span> },
                      {
                        value: "extra-income",
                        label: <span>Extra Income</span>,
                      },
                      { value: "loan", label: <span>Loan</span> },
                      { value: "other", label: <span>Other</span> },
                    ]}
                    aria-required
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="amount"
                  label={<span className="text-base">Amount:</span>}
                  required
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Amount..."
                    className="!p-1"
                    suffix="€"
                    required
                    min={0}
                    minLength={1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="date"
                  label={<span className="text-base">Date:</span>}
                  required
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    required
                    className="!p-1"
                  />
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
            layout="horizontal"
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            labelAlign="left"
            className="w-full"
          >
            <Row gutter={[4, 4]} justify={"center"} className="!mt-5">
              <Col span={24}>
                <Form.Item
                  name="description"
                  label={<span className="text-base">Description:</span>}
                  required
                >
                  <Input
                    placeholder="Description..."
                    required
                    minLength={3}
                    className="!p-1"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="category"
                  label={<span className="text-base">Category:</span>}
                  required
                >
                  <Select
                    className="[&_.ant-select-selector]:!p-3 [&_.ant-select-selector]:!pl-1 !flex !items-center"
                    flex="1 1 250px"
                    style={{ width: "100%" }}
                    placeholder="Select a category.."
                    options={[
                      { value: "salary", label: <span>Salary</span> },
                      { value: "business", label: <span>Business</span> },
                      {
                        value: "extra-income",
                        label: <span>Extra Income</span>,
                      },
                      { value: "loan", label: <span>Loan</span> },
                      { value: "other", label: <span>Other</span> },
                    ]}
                    aria-required
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="amount"
                  label={<span className="text-base">Amount:</span>}
                  required
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Amount..."
                    className="!p-1"
                    suffix="€"
                    required
                    min={0}
                    minLength={1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="date"
                  label={<span className="text-base">Date:</span>}
                  required
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    required
                    className="!p-1"
                  />
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
    </>
  );
};

export default Incomes;
