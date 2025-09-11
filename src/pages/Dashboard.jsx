import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import ReactApexChart from "react-apexcharts";
import { Button, Col, Divider, Input, message, Row, Space, Table } from "antd";
import {
  CaretRightOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FallOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  formatNumber,
  getBalance,
  getIncomeAmount,
  getIncomeDates,
  getIncomes,
  getExpenses,
  filterThisMonth,
} from "../utils/hooks";
import { DataContext } from "../utils/context";
import ExcelUploader from "../components/ExcelUploader";
import { utils, writeFile } from "xlsx";
import { categoryTag } from "../utils";

const { Search } = Input;
const Dashboard = () => {
  const [visible, setVisible] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, setData } = useContext(DataContext);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setVisible(true);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.entires(item).some(([key, value]) => {
        if (!value) return false;
        if (key.toLowerCase().includes("date")) {
          const formatted = dayjs(value).format("DD/MM/YYYY");
          return formatted.toLowerCase().includes(value);
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm]);

  const expenses = getExpenses();
  const incomes = getIncomes();
  const balance = getBalance();

  const exportToExcel = (data) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "CashFlow");
    writeFile(workbook, "cashflow.xlsx");
  };

  const getCategoryAmount = (category) => {
    return Math.round(
      data
        .filter((item) => item.category === category && item.type === "expense")
        .reduce((sum, val) => sum + Number(val.amount), 0)
    );
  };

  const barChart = {
    series: [
      {
        name: "Expense",
        data: [
          getCategoryAmount("food"),
          getCategoryAmount("entertainment"),
          getCategoryAmount("household"),
          getCategoryAmount("transport"),
          getCategoryAmount("other"),
        ],
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

  function handleLineData(dates, amounts) {
    const mappedData = {};

    console.log("dates", dates, "amoutn", amounts)

    dates.forEach((date, index) => {
      const amount = parseFloat(amounts[index]);
      mappedData[date] = (mappedData[date] || 0) + amount;
    });

    const sortedArray = Object.entries(mappedData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [dayB, monthB] = b.date.split("/").map(Number);
        return (
          new Date(2024, monthA - 1, dayA) - new Date(2024, monthB - 1, dayB)
        );
      });
    return {
      dates: sortedArray.map((item) => item.date),
      values: sortedArray.map((item) => item.amount),
    };
  }
  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };
  const getPopularCategories = () => {
    const result = {};

    const mappedCategories = expenses.map((item) => {
      return {
        category: item.category,
        amount: item.amount,
      };
    });
    mappedCategories.forEach((item) => {
      result[item.category] = (result[item.category] | 0) + Number(item.amount);
    });

    const sortedValues = Object.entries(result)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => {
        return b.amount - a.amount;
      });

    return sortedValues.slice(0, 3);
  };

  const sortedCategories = getPopularCategories();

  const lineData = handleLineData(getIncomeDates(), getIncomeAmount());

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
    filterThisMonth(incomes)
      .map((item) => Number(item.amount))
      .reduce((sum, val) => sum + val, 0),

    filterThisMonth(expenses)
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

  const onSearch = (searchValue) => {
    const val = searchValue.trim().toLowerCase();

    if (!val) return;

    setSearchTerm(val);
  };

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
        const date = dayjs(val).format("DD/MM/YYYY");
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
      title: "Transaction Amount (€)",
      dataIndex: "amount",
      key: "amount",
      render: (item) => <div>{formatNumber(item)}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            style={{ backgroundColor: "red" }}
            onClick={() => {
              const updatedArr = data.filter(
                (val) => val.index !== record.index
              );
              localStorage.setItem("cashFlow", JSON.stringify(updatedArr));
              setData(updatedArr);
              success("Transaction removed");
            }}
          >
            X
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        className={`w-full h-full transition-all duration-700 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {contextHolder}
        <h1 className="text-3xl font-bold select-none">Overview</h1>
        {data && data.length > 0 ? (
          <section className="!mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 ">
              {expenses[expenses.length - 1] && (
                <div className="bg-white rounded-2xl !p-4 ">
                  <div className="font-bold text-lg !mb-3">
                    Popular Categories
                  </div>
                  {sortedCategories.map((item, index) => {
                    return (
                      <div className="flex justify-between !mb-1" key={index}>
                        <div className="text-base capitalize">
                          {item.category}
                        </div>
                        <div className="text-xl text-red-600 break-all w-1/2 text-end">
                          -{formatNumber(item.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {expenses[expenses.length - 1] && (
                <div className="bg-white rounded-2xl !p-4 ">
                  <div className="font-bold text-lg !mb-3">Recent Expenses</div>
                  <div className="flex justify-between !mb-1">
                    <div className="text-base capitalize">
                      <div>{expenses[expenses.length - 1].description}</div>
                      <div className="text-sm text-gray-400">
                        {dayjs(expenses[expenses.length - 1].date).format(
                          "DD/MM/YYYY"
                        )}
                      </div>
                    </div>
                    <div className="text-xl text-red-600 break-all w-1/2 text-end">
                      -{formatNumber(expenses[expenses.length - 1].amount)}
                    </div>
                  </div>
                  {expenses[expenses.length - 2] &&
                    expenses[expenses.length - 2].description && (
                      <div className="flex justify-between !mb-1">
                        <div className="text-base capitalize">
                          <div>{expenses[expenses.length - 2].description}</div>
                          <div className="text-sm text-gray-400">
                            {dayjs(expenses[expenses.length - 2].date).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                        </div>
                        <div className="text-xl text-red-600 text-end">
                          -{formatNumber(expenses[expenses.length - 2].amount)}
                        </div>
                      </div>
                    )}
                </div>
              )}
              <div className="bg-white rounded-2xl !p-4 ">
                <div className="font-bold text-lg !mb-3">Last transaction</div>
                <div className="flex justify-between !mb-1">
                  <div className="text-base">Previous balance</div>
                  <div className="text-xl text-gray-600 w-1/2 break-all text-end">
                    {data.length !== 1
                      ? data[data.length - 1].type == "expense"
                        ? formatNumber(
                            balance + Number(data[data.length - 1].amount)
                          )
                        : formatNumber(
                            balance - Number(data[data.length - 1].amount)
                          )
                      : "0"}
                  </div>
                </div>
                <div className="flex justify-between !mb-1">
                  <div className="text-base capitalize">
                    {data[data.length - 1].category}
                  </div>
                  <div
                    className={`text-xl w-1/2 break-all text-end ${
                      data[data.length - 1].type == "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {data[data.length - 1].type == "expense" ? "-" : "+"}
                    {formatNumber(Number(data[data.length - 1].amount))}
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <hr className="border-t border-gray-300 my-4 w-50" />
                </div>
                <div className="flex justify-between !mb-1">
                  <div className="text-base">Current balance</div>
                  <div className="text-xl text-green-600 w-1/2 break-all text-end">
                    {formatNumber(balance)}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl !p-4 flex ">
                <div className="w-1/2 flex justify-center items-center !mr-3">
                  <ReactApexChart
                    options={thisMonth.options}
                    series={thisMonthSeries}
                    type="donut"
                    width={150}
                  />
                </div>
                <div className="w-1/2 flex  text-end">
                  <div className="flex justify-end flex-col text-xl items-end w-full">
                    <div className="!mb-1 text-green-600 flex justify-end w-full flex-col text-end">
                      <div className="text-base ">This months income</div>
                      {formatNumber(
                        filterThisMonth(incomes)
                          .map((item) => Number(item.amount))
                          .reduce((sum, val) => sum + val, 0)
                      )}
                    </div>
                    <div className="!mb-1 text-red-600 flex justify-end w-full flex-col text-end">
                      <div className="text-base">This months expense</div>
                      {formatNumber(
                        filterThisMonth(expenses)
                          .map((item) => Number(item.amount))
                          .reduce((sum, val) => sum + val, 0)
                      )}
                    </div>
                    <div className="w-full flex justify-end">
                      <hr className="border-t border-gray-300 my-4 w-full" />
                    </div>
                    <div className="text-gray-600 flex justify-end w-full text-end">
                      {formatNumber(
                        filterThisMonth(incomes)
                          .map((item) => Number(item.amount))
                          .reduce((sum, val) => sum + val, 0) -
                          filterThisMonth(expenses)
                            .map((item) => Number(item.amount))
                            .reduce((sum, val) => sum + val, 0)
                      )}
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
          </section>
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
        <Row className="w-full !mt-5 flex justify-between" gutter={[18, 18]}>
          <Col xs={24} sm={24} md={12}>
            <Search
              placeholder="Search something..."
              onSearch={onSearch}
              enterButton
              allowClear
              style={{ width: 300 }}
              className=""
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            className="block md:!flex md:!justify-end"
          >
            <ExcelUploader />
            {filteredData && filteredData.length > 0 && (
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                onClick={() => exportToExcel(filteredData)}
                className="!ml-2"
              >
                Export to Excel
              </Button>
            )}
          </Col>
        </Row>
        <div className="!mt-5 hidden lg:block">
          <Row className="!mt-5">
            <Col span={24}>
              <Table
                rowKey={(record) => `${record.index}-${record.date}`}
                columns={columns}
                dataSource={filteredData}
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
                                      const updatedArr = data.filter(
                                        (val) => val.index !== item.index
                                      );
                                      localStorage.setItem(
                                        "cashFlow",
                                        JSON.stringify(updatedArr)
                                      );
                                      setData(updatedArr);
                                      success("Transaction removed");
                                      setIsOptionsOpen(false);
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
                          <div className="flex items-start justify-start">
                            {categoryTag(item)}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-xl flex items-center w-fit ${
                          item.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.type === "income" ? "+" : "-"}
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
      </div>
    </>
  );
};

export default Dashboard;
