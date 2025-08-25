import { Button, Col, Row, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router";
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
    render: (val) => {
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const localData = undefined;

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
        data: [],
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
        data: [],
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
    <div
      className={`w-full h-full transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div>
        <div className="text-3xl font-bold">Quick actions</div>
        <div className="!mt-5">
          <Button
            type="primary"
            style={{
              marginRight: "1rem",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
            }}
            onClick={() => {
              navigate("/income");
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
            onClick={() => {
              navigate("/expense");
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>
      {/* {!localData ? (
        <div className="w-full flex justify-center items-center h-full">
          <div className="text-gray-400 text-lg">No data to display</div>
        </div>
      ) : ( */}
      <div>
        <Row style={{ marginTop: "2rem", gap: "16px" }}>
          <Col>
            <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
              <div className="text-lg font-semibold">Total Expense</div>
              <div className="text-2xl">0 €</div>
            </div>
          </Col>
          <Col>
            <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
              <div className="text-lg font-semibold">Total Income</div>
              <div className="text-2xl">0 €</div>
            </div>
          </Col>
          <Col>
            <div className="bg-gray-50 rounded-2xl" style={{ padding: "3rem" }}>
              <div className="text-lg font-semibold">This Month's Neto</div>
              <div className="text-2xl">0 €</div>
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
              rowClassName={() => {
                return "row-income";
              }}
            />
          </Col>
        </Row>
      </div>
      {/* )} */}
    </div>
  );
};

export default Dashboard;
