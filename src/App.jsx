import { Divider, Layout, Menu } from "antd";
import { ContainerOutlined, PieChartOutlined } from "@ant-design/icons";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import { lazy } from "react";
import Incomes from "./pages/Incomes";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const { Header, Footer, Sider, Content } = Layout;
const items = [
  { key: "dashboard", icon: <PieChartOutlined />, label: "Dashboard" },
  { key: "income", icon: <ContainerOutlined />, label: "Incomes" },
  { key: "expense", icon: <ContainerOutlined />, label: "Expenses" },
  { key: "statistics", icon: <ContainerOutlined />, label: "Statistics" },
];
const App = () => {
  const navigate = useNavigate();

  const handleNavigate = (key) => {
    switch (key) {
      case "dashboard":
        navigate("/");
        break;
      case "income":
        navigate("/income");
        break;
      case "expense":
        navigate("/expense");
        break;
      case "statistics":
        navigate("/statistics");
        break;
    }
  };

  return (
    <>
      <Layout className="w-screen h-screen overflow-x-hidden overflow-y-auto">
        <Sider width="15%" className="text-white" style={{ padding: "16px" }}>
          <h1 className="text-2xl text-center font-bold">ExpenseTrack</h1>
          <Menu
            style={{ marginTop: "16px" }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
            items={items}
            onClick={(value) => {
              handleNavigate(value.key);
            }}
          />
        </Sider>
        <Layout>
          <Header
            className="flex items-center"
            style={{ background: "#f5f5f5" }}
          >
            <h1 className="text-2xl font-bold">ExpenseTrack</h1>
          </Header>
          <Divider style={{ margin: "0px" }} />
          <Content style={{ padding: "50px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />}></Route>
              <Route path="/income" element={<Incomes />}></Route>
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
