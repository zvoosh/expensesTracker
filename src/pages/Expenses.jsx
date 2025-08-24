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
import ReactApexChart from "react-apexcharts";

const Expenses = () => {
  const [form] = Form.useForm();

  const piChart = {
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return val.toFixed(1) + "%"; // shows percentage with 1 decimal
        },
      },
      labels: ["A", "B", "C", "D", "E"],
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
      <h2 className="text-3xl font-bold">Expenses</h2>
      <Row gutter={16}>
        <Col >
          <Row style={{ marginTop: "2rem", marginBottom: "2rem", gap: "16px" }}>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Food</div>
                <div className="text-2xl">$2,300.00</div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Entertainment</div>
                <div className="text-2xl">$3,200.00</div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Household</div>
                <div className="text-2xl">$10,000.00</div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Transport</div>
                <div className="text-2xl">$10,000.00</div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Other</div>
                <div className="text-2xl">$10,000.00</div>
              </div>
            </Col>
            <Col span={6}>
              <div
                className="bg-gray-50 rounded-2xl"
                style={{ padding: "3rem" }}
              >
                <div className="text-lg font-semibold">Total Expenses</div>
                <div className="text-2xl">$10,000.00</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

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
