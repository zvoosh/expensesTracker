import { Button, Col, Row, Space, Table, Tag } from "antd";
import ReactApexChart from "react-apexcharts";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "5",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "6",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "7",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "8",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "9",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
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
      text: "Product Trends by Month",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  },
};
const Dashboard = () => {
  return (
    <div className="w-full h-full">
      <div>
        <div className="text-3xl font-bold">Quick actions</div>
        <div style={{ marginTop: "1rem" }}>
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
      <Row style={{ marginTop: "3rem", gap: "16px" }}>
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
            <div className="text-lg font-semibold">Neto</div>
            <div className="text-2xl">$900.00</div>
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
              options={state.options}
              series={state.series}
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
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
