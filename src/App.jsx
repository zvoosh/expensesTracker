import { Divider, Layout, Menu } from "antd";
import { ContainerOutlined, PieChartOutlined } from "@ant-design/icons";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Incomes = lazy(() => import("./pages/Incomes"));
const Expenses = lazy(() => import("./pages/Expenses"));

const { Header, Sider, Content } = Layout;
const items = [
  { key: "/", icon: <PieChartOutlined />, label: "Dashboard" },
  { key: "/income", icon: <ContainerOutlined />, label: "Incomes" },
  { key: "/expense", icon: <ContainerOutlined />, label: "Expenses" },
  { key: "/statistics", icon: <ContainerOutlined />, label: "Statistics" },
];
const App = () => {
  const navigate = useNavigate();
  return (
    <>
      <Layout className="w-screen h-screen">
        <Sider width="15%" className="text-white" style={{ padding: "16px" }}>
          <h1 className="text-2xl text-center font-bold">ExpenseTrack</h1>
          <Menu
            style={{ marginTop: "16px" }}
            defaultOpenKeys={["sub1"]}
            selectedKeys={[location.pathname]}
            mode="inline"
            theme="dark"
            items={items}
            onClick={(value) => {
              navigate(value.key);
            }}
          />
        </Sider>
        <Layout className="flex flex-col h-screen overflow-x-hidden  overflow-y-auto">
          <Header
            className="flex items-center"
            style={{ background: "#f5f5f5" }}
          >
            <h1 className="text-2xl font-bold">ExpenseTrack</h1>
          </Header>
          <Divider style={{ margin: "0px" }} />
          <Content style={{ padding: "50px" }}>
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
