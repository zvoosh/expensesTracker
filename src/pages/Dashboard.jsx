import { DownOutlined, EditOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router";

const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const data = JSON.parse(localStorage.getItem("cashFlow")) || [];
  const food = Math.round(
    data
      .filter((item) => item.category === "food" && item.type === "expense")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const entertainment = Math.round(
    data
      .filter(
        (item) => item.category === "entertainment" && item.type === "expense"
      )
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const transport = Math.round(
    data
      .filter(
        (item) => item.category === "transport" && item.type === "expense"
      )
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );

  const household = Math.round(
    data
      .filter(
        (item) => item.category === "household" && item.type === "expense"
      )
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );
  const other = Math.round(
    data
      .filter((item) => item.category === "other" && item.type === "expense")
      .reduce((sum, val) => sum + Number(val.amount), 0)
  );
  const barChart = {
    series: [
      {
        name: "Expense",
        data: [food, entertainment, household, transport, other],
      },
    ],
    options: {
      title: {
        text: "Expense Category",
        align: "left",
      },
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "Food",
          "Entertainment",
          "Household",
          "Transport",
          "Other",
        ],
      },
    },
  };

  const getIncomes = JSON.parse(localStorage.getItem("cashFlow"))
    ? JSON.parse(localStorage.getItem("cashFlow")).filter(
        (item) => item.type === "income"
      ) || []
    : [];

  const getExpenses = JSON.parse(localStorage.getItem("cashFlow"))
    ? JSON.parse(localStorage.getItem("cashFlow")).filter(
        (item) => item.type === "expense"
      ) || []
    : [];

  const getIncomeDates = getIncomes.map((item) =>
    dayjs(item.date).format("DD/MM")
  );

  const balanceSum =
    getIncomes.reduce((sum, val) => sum + Number(val.amount), 0) -
    getExpenses.reduce((sum, val) => sum + Number(val.amount), 0);

  function handleLineData(dates, values) {
    const resultMap = {};

    dates.forEach((date, index) => {
      const value = parseFloat(values[index]);
      resultMap[date] = (resultMap[date] || 0) + value;
    });

    const sortedArray = Object.entries(resultMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [dayB, monthB] = b.date.split("/").map(Number);
        return (
          new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB)
        );
      });

    return {
      dates: sortedArray.map((item) => item.date),
      values: sortedArray.map((item) => item.value),
    };
  }

  const lineData = handleLineData(
    getIncomeDates,
    getIncomes.map((item) => item.amount)
  );

  const lineChart = {
    series: [
      {
        name: "Income",
        data: lineData.values,
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
        text: "Income represent",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: lineData.dates,
      },
    },
  };

  const thisMonthSeries = [
    getIncomes
      .map((item) => Number(item.amount))
      .reduce((sum, val) => sum + val, 0),

    getExpenses
      .map((item) => Number(item.amount))
      .reduce((sum, val) => sum + val, 0),
  ];
  const thisMonth = {
    options: {
      chart: {
        type: "donut",
      },
      tooltip: {
        enabled: false,
      },
      colors: ["rgb(5, 150, 105)", "rgb(220, 38, 38)"],
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 125,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

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
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button type="primary" style={{ backgroundColor: "green" }}>
    //         <EditOutlined />
    //       </Button>
    //       <Button
    //         type="primary"
    //         style={{ backgroundColor: "red" }}
    //         onClick={() => {
    //           const dataArr =
    //             JSON.parse(localStorage.getItem("cashFlow")) || [];

    //           const updatedArr = dataArr.filter(
    //             (item) => item.index !== record.index
    //           );
    //           localStorage.setItem("cashFlow", JSON.stringify(updatedArr));
    //           setData(
    //             JSON.parse(localStorage.getItem("cashFlow"))
    //               ? JSON.parse(localStorage.getItem("cashFlow")) || []
    //               : []
    //           );
    //         }}
    //       >
    //         X
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div
      className={`w-full h-full transition-all duration-700 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h2 className="text-3xl font-bold select-none">Overview</h2>
      {data && data.length > 0 ? (
        <div className="!mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 ">
            <div className="bg-white !p-5 rounded-2xl !p-4">
              <h1 className="font-bold text-lg !mb-3">Recent Expenses</h1>
              {getExpenses[getExpenses.length - 1] &&
              getExpenses[getExpenses.length - 1].description ? (
                <div className="flex justify-between !mb-1">
                  <div className="text-xl capitalize">
                    {getExpenses[getExpenses.length - 1].description}
                  </div>
                  <div className="text-2xl text-red-600">
                    -$
                    {getExpenses[getExpenses.length - 1].amount}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 flex justify-center">
                  No expenses currently
                </div>
              )}
              {getExpenses[getExpenses.length - 2] &&
                getExpenses[getExpenses.length - 2].description && (
                  <div className="flex justify-between !mb-1">
                    <div className="text-xl capitalize">
                      {getExpenses[getExpenses.length - 2].description}
                    </div>
                    <div className="text-2xl text-red-600">
                      -${getExpenses[getExpenses.length - 2].amount}
                    </div>
                  </div>
                )}
              {getExpenses[getExpenses.length - 3] &&
                getExpenses[getExpenses.length - 3].description && (
                  <div className="flex justify-between !mb-1">
                    <div className="text-xl uppercase">
                      {getExpenses[getExpenses.length - 3].description}
                    </div>
                    <div className="text-2xl text-red-600">
                      -${getExpenses[getExpenses.length - 3].amount}
                    </div>
                  </div>
                )}
            </div>
            <div className="bg-white !p-5 rounded-2xl !p-4">
              <h1 className="font-bold text-lg !mb-3">Last transaction</h1>
              <div className="flex justify-between !mb-1">
                <div className="text-xl">Balance</div>
                <div className="text-2xl text-green-600">
                  $
                  {data.length !== 1
                    ? balanceSum + Number(data[data.length - 1].amount)
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between !mb-1">
                <div className="text-xl">Last transaction</div>
                <div
                  className={`text-2xl ${
                    data[data.length - 1].type == "expense"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {data[data.length - 1].type == "expense" ? "-" : "+"}$
                  {Number(data[data.length - 1].amount)}
                </div>
              </div>
              <div className="w-full flex justify-end">
                <hr className="border-t border-gray-300 my-4 w-50" />
              </div>
              <div className="w-full flex justify-end text-2xl text-green-600">
                ${balanceSum}
              </div>
            </div>
            <div className="bg-white rounded-2xl !p-4 flex ">
              <div className="w-1/2 flex justify-center items-center">
                <ReactApexChart
                  options={thisMonth.options}
                  series={thisMonthSeries}
                  type="donut"
                  width={150}
                />
              </div>
              <div className="w-1/2 flex justify-between">
                <div className="flex flex-col h-full">
                  <div className="self-start text-lg font-bold">This month</div>

                  <div className="flex flex-col items-center justify-center flex-grow !mb-5 select-none">
                    <div className="text-green-600 text-3xl">
                      <UpOutlined />
                    </div>
                    <div className="text-red-600 text-3xl">
                      <DownOutlined />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center flex-col text-2xl items-end">
                  <div className="!mb-1 text-green-600">
                    $
                    {getIncomes
                      .map((item) => Number(item.amount))
                      .reduce((sum, val) => sum + val, 0)}
                  </div>
                  <div className="!mb-1 text-red-600">
                    -$
                    {getExpenses
                      .map((item) => Number(item.amount))
                      .reduce((sum, val) => sum + val, 0)}
                  </div>
                  <div className="w-full flex justify-end">
                    <hr className="border-t border-gray-300 my-4 w-full" />
                  </div>
                  <div className="text-green-600">
                    $
                    {getIncomes
                      .map((item) => Number(item.amount))
                      .reduce((sum, val) => sum + val, 0) -
                      getExpenses
                        .map((item) => Number(item.amount))
                        .reduce((sum, val) => sum + val, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="!mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl !p-4">
              <ReactApexChart
                options={barChart.options}
                series={barChart.series}
                type="bar"
                height={350}
              />
            </div>
            <div className="bg-white rounded-2xl !p-4">
              <ReactApexChart
                options={lineChart.options}
                series={lineChart.series}
                type="line"
                height={350}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full !my-5">
          <Link to={"/income"}>
            <Button type="primary" className="!mr-5">
              Add Income
            </Button>
          </Link>
          <Link to={"/expense"}>
            <Button type="primary">Add Expense</Button>
          </Link>
        </div>
      )}
      <div className="!mt-5">
        <Row className="!mt-5">
          <Col span={24}>
            <Table
              rowKey={(record) => `${record.index}-${record.date}`}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5, position: "bottomRight" }}
              rowClassName={(item) => {
                if (item.type === "income") return "row-income";
                if (item.type === "expense") return "row-expense";
              }}
              scroll={{ x: 1000 }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
