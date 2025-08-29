import { Divider, Layout, Menu } from "antd";
import {
  BankOutlined,
  ContainerOutlined,
  MenuOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import { lazy, useState } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incomes = lazy(() => import("./pages/Incomes"));
const Expenses = lazy(() => import("./pages/Expenses"));

const { Header, Sider, Content } = Layout;
const items = [
  { key: "/", icon: <BankOutlined />, label: "Overview" },
  { key: "/income", icon: <ContainerOutlined />, label: "Incomes" },
  { key: "/expense", icon: <ContainerOutlined />, label: "Expenses" },
];
const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Layout className="w-screen h-screen">
        <div
          className={`fixed top-0 left-0 h-screen bg-gray-900 text-white !p-4 z-50 w-screen transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-center w-full relative">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ paddingLeft: "16px" }}
            >
              <MenuOutlined onClick={() => setIsVisible((prev) => !prev)} />
            </div>
            <h1 className="text-2xl text-center font-bold">ExpenseTrack</h1>
          </div>
          <Menu
            style={{ marginTop: "16px" }}
            defaultOpenKeys={["sub1"]}
            selectedKeys={[location.pathname]}
            mode="inline"
            theme="dark"
            items={items}
            onClick={(value) => {
              navigate(value.key);
              setIsVisible((prev) => !prev);
            }}
          />
        </div>
        <Layout className="flex flex-col h-screen overflow-x-hidden  overflow-y-auto bg-gray-200">
          <Header
            className="flex items-center justify-center w-full relative"
            style={{ background: "#f5f5f5" }}
          >
            {!isVisible && (
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ paddingLeft: "16px" }}
              >
                <MenuOutlined onClick={() => setIsVisible((prev) => !prev)} />
              </div>
            )}
            <h1 className="text-2xl font-bold select-none">ExpenseTrack</h1>
          </Header>
          <Divider style={{ margin: "0px" }} />
          <Content className="!p-5">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/income" element={<Incomes />} />
              <Route path="/expense" element={<Expenses />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
// grid-col responsive
