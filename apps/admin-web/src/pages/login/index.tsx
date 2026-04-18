import { Form, Input, Button, Card, Typography, message } from 'antd';
import { getToken } from '@/utils/auth';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { loginApi } from '@/api/auth';
import { useMenuStore } from '@/store/menu';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setMenus = useMenuStore((s) => s.setMenus);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');

  const onFinish = async (values: any) => {
    try {
      const { code, data } = (await loginApi(values)) as any;

      if (code === 200) {
        setAuth(data);
        setMenus(data.menus);

        if (redirect) {
          window.location.href = redirect;
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate('/');
    }
  }, []);

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <Title level={3} style={{ margin: 0 }}>
            Admin System
          </Title>
          <Text type="secondary">后台管理系统登录</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #2b3a55 0%, #4b6cb7 100%)',
  },
  card: {
    width: 360,
    borderRadius: 12,
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
};
