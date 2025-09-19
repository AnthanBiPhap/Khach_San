import React, { useState, useMemo } from 'react';
import {
  PieChartOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ToolOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  StarOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number] & {
  label: string;
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

function createMenuItem(
  label: string,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems = [
  createMenuItem('Dashboard', '/', <PieChartOutlined />),
  createMenuItem('Users', '/users', <TeamOutlined />),
  createMenuItem('Bookings', '/bookings', <BookOutlined />),
  createMenuItem('Booking Status', '/booking-status', <FileDoneOutlined />),
  createMenuItem('Invoices', '/invoices', <FileTextOutlined />),
  createMenuItem('Rooms', '/rooms', <HomeOutlined />),
  createMenuItem('Room Types', '/room-types', <AppstoreOutlined />),
  createMenuItem('Services', '/services', <ToolOutlined />),
  createMenuItem('Service Bookings', '/service-bookings', <ShoppingCartOutlined />),
  createMenuItem('Locations', '/locations', <EnvironmentOutlined />),
  createMenuItem('Reviews', '/reviews', <StarOutlined />),
];

const Defaultlayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const currentPageTitle = useMemo(() => {
    const currentItem = menuItems.find(item => item.key === location.pathname);
    return currentItem?.label || 'Dashboard';
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu 
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 16 }}>
          <h2 style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
            {currentPageTitle}
          </h2>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 160px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', padding: '10px 50px' }}>
          Hotel Management System {new Date().getFullYear()} Created by Your Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Defaultlayout;