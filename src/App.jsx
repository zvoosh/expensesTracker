import { lazy, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Divider, Layout, Menu } from "antd";
import {
  BankOutlined,
  ContainerOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import "./App.css";

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
        <Sider className="hidden lg:block !p-2" width={'15%'}>
          <h1 className="w-full text-white text-xl font-bold !mt-2 !mb-4 text-center">
            ExpenseTrack
          </h1>
          <Menu
            className="mt-4"
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
        </Sider>
        <div
          className={`block lg:hidden fixed top-0 left-0 !p-2 overflow-hidden h-screen bg-gray-900 text-white p-4 z-50 w-full sm:w-1/2 lg:w-2/6 2xl:w-1/6 transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-full grid grid-cols-[auto_1fr] items-center !mt-2 !mb-4">
            <MenuOutlined
              className="cursor-pointer !ml-2"
              onClick={() => setIsVisible((prev) => !prev)}
            />
            <h1 className="text-xl font-bold text-center w-full">
              ExpenseTrack
            </h1>
          </div>
          <Menu
            className="mt-4"
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
        <Layout className="flex flex-col h-screen overflow-x-hidden overflow-y-auto bg-gray-200">
          <Header
            className="flex items-center justify-center w-full relative"
            style={{ background: "#f5f5f5" }}
          >
            {!isVisible && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 block lg:hidden">
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
