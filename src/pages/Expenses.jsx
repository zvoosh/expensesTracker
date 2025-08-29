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
  LeftOutlined,
  PlusOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  SunOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router";

const Expenses = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
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

  const food = Math.round(
    data
      .filter((item) => item.category === "food")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const entertainment = Math.round(
    data
      .filter((item) => item.category === "entertainment")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const transport = Math.round(
    data
      .filter((item) => item.category === "transport")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const household = Math.round(
    data
      .filter((item) => item.category === "household")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );
  const other = Math.round(
    data
      .filter((item) => item.category === "other")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );
  const totalExp = Math.round(
    data.reduce((sum, val) => sum + Number(val.amount), 0)
  );
  const foodSeries = [food, totalExp - food];
  const entertainmentSeries = [entertainment, totalExp - entertainment];
  const transportSeries = [transport, totalExp - transport];
  const householdSeries = [household, totalExp - household];
  const otherSeries = [other, totalExp - other];
  const foodChart = {
    options: {
      chart: {
        width: 120,
        type: "pie",
      },
      tooltip: {
        enabled: false,
      },

      colors: ["rgb(220, 38, 38)", "rgba(124, 122, 122, 0.47)"],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
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

  const getFilteredExpensesSum = (data, filterValue) => {
    const foodExp = data.filter((item) => item.category == filterValue);
    return foodExp.reduce((sum, item) => sum + Number(item.amount), 0);
  };

  return (
    <div
      className={`page-containter !pb-10 transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold !mb-5 select-none flex item-center">
        Expenses
      </h2>
      {data.length > 0 && (
        <div className="grid grid-cols-5 gap-4 !my-5">
          <div className="bg-gray-50 rounded-2xl flex justify-around items-center !p-5 cursor-pointer select-none">
            <div>
              <ReactApexChart
                options={foodChart.options}
                series={foodSeries}
                type="donut"
                width={120}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                <ShoppingCartOutlined className="!mr-2" /> Food
              </div>
              <div className="text-2xl">
                {getFilteredExpensesSum(data, "food")} €
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-around items-center !p-5 cursor-pointer select-none">
            <div>
              <ReactApexChart
                options={foodChart.options}
                series={entertainmentSeries}
                type="donut"
                width={120}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                <CameraOutlined className="!mr-2" /> Entertainment
              </div>
              <div className="text-2xl">
                {getFilteredExpensesSum(data, "entertainment")} €
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-around items-center !p-10 cursor-pointer select-none">
            <div>
              <ReactApexChart
                options={foodChart.options}
                series={householdSeries}
                type="donut"
                width={120}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                <HomeOutlined className="!mr-2" /> Household
              </div>
              <div className="text-2xl">
                {getFilteredExpensesSum(data, "household")} €
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-around items-center !p-10 cursor-pointer select-none">
            <div>
              <ReactApexChart
                options={foodChart.options}
                series={transportSeries}
                type="donut"
                width={120}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                <CarOutlined className="!mr-2" /> Transport
              </div>
              <div className="text-2xl">
                {getFilteredExpensesSum(data, "transport")} €
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl flex justify-around items-center !p-10 cursor-pointer select-none">
            <div>
              <ReactApexChart
                options={foodChart.options}
                series={otherSeries}
                type="donut"
                width={120}
              />
            </div>
            <div>
              <div className="text-lg font-semibold">
                <SunOutlined className="!mr-2" /> Other
              </div>
              <div className="text-2xl">
                {getFilteredExpensesSum(data, "other")} €
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-gray-400 text-xs !pl-1 !pb-2">
        create new expense
      </div>
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
                  { value: "food", label: <span>Food</span> },
                  { value: "entertainment", label: <span>Entertainment</span> },
                  { value: "household", label: <span>Household</span> },
                  { value: "transport", label: <span>Transport</span> },
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
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add Expense
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

export default Expenses;
