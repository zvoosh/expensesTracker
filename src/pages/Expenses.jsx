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
import {
  CameraOutlined,
  CarOutlined,
  HomeOutlined,
  PlusOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  SunOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";

const Expenses = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const localData = undefined;

  const state = {
    series: [localData],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Food", "Entertainment", "Household", "Transport", "Other"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

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
      className={`page-containter !pb-10 transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold">Expenses</h2>
      {localData ? (
        <div>
          <div id="chart">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="pie"
              width={380}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Row gutter={16}>
        <Col>
          <Row className="!mb-5 !mt-5 gap-5">
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl  !p-10">
                <div className="text-lg font-semibold">
                  <ShoppingCartOutlined /> Food
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl  !p-10">
                <div className="text-lg font-semibold">
                  <CameraOutlined /> Entertainment
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl  !p-10">
                <div className="text-lg font-semibold">
                  <HomeOutlined /> Household
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl  !p-10">
                <div className="text-lg font-semibold">
                  <CarOutlined /> Transport
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl  !p-10">
                <div className="text-lg font-semibold">
                  <SunOutlined /> Other
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="bg-gray-50 rounded-2xl !p-10">
                <div className="text-lg font-semibold">
                  <SafetyOutlined /> Total Expenses
                </div>
                <div className="text-2xl">0€</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="text-gray-400 text-xs !pl-1 !pb-2">
        create a new expense
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
                  { value: "food", label: <span>Food</span> },
                  { value: "entertainment", label: <span>Entertainment</span> },
                  { value: "household", label: <span>Household</span> },
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
                suffix={"€"}
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
            Add Expense
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

export default Expenses;
