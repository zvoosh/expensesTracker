import { Button, Col, Row, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";
const columns = [
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Date",
    key: "date",
    dataIndex: "date",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (val, item) => {
      return <div className="tag tag-food">{val}</div>;
    },
  },
  {
    title: "Amount (€)",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Action",
    key: "action",
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

const Dashboard = () => {
  const getMonths = () => {
    const months = [];
    const now = dayjs();

    for (let i = -8; i <= 0; i++) {
      const month = now.add(i, "month").format("MMM"); // "Jan", "Feb", etc.
      months.push(month);
    }

    return months;
  };
  const state = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Neto by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: getMonths(),
      },
    },
  };
  const barState = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Expenses by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: getMonths(),
      },
    },
  };
  return (
    <div className="w-full h-full">
      <div>
        <div className="text-3xl font-bold">Quick actions</div>
        <div style={{ marginTop: "2em" }}>
          <Button
            type="primary"
            style={{
              marginRight: "1rem",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
            }}
          >
            Add Income
          </Button>
          <Button
            type="primary"
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>
      <Row style={{ marginTop: "2rem", gap: "16px" }}>
        <Col span={4}>
          <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
            <div className="text-lg font-semibold">Total Expense</div>
            <div className="text-2xl">$2,300.00</div>
          </div>
        </Col>
        <Col span={4}>
          <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
            <div className="text-lg font-semibold">Total Income</div>
            <div className="text-2xl">$3,200.00</div>
          </div>
        </Col>
        <Col span={4}>
          <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
            <div className="text-lg font-semibold">This Month's Neto</div>
            <div className="text-2xl">$10,000.00</div>
          </div>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginTop: "3rem" }}>
        <Col span={12}>
          <div id="chart">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="line"
              height={350}
            />
          </div>
        </Col>
        <Col span={12}>
          <div id="chart">
            <ReactApexChart
              options={barState.options}
              series={barState.series}
              type="bar"
              height={350}
            />
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: "3rem" }}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5, position: "bottomRight" }}
            rowClassName={(record) => {
              return "row-income";
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
