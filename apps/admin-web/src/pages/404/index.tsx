import { Result, Button, Space, Typography } from 'antd';

const { Paragraph, Text, Link } = Typography;

export default function Page404() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
      }}
    >
      <Result
        status="404"
        title={
          <Typography.Title
            level={1}
            style={{ fontSize: '72px', marginBottom: 0 }}
          >
            404
          </Typography.Title>
        }
        subTitle={
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              抱歉，页面未找到
            </Typography.Title>
            <Paragraph type="secondary" style={{ fontSize: '16px', margin: 0 }}>
              您访问的页面可能已被删除、更名或暂时不可用
            </Paragraph>
          </Space>
        }
        extra={
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Button type="primary" size="large" onClick={handleGoHome}>
                返回首页
              </Button>
            </Space>

            <div style={{ marginTop: 32, opacity: 0.6 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                错误代码: 404 | 资源未找到
              </Text>
            </div>
          </Space>
        }
      />
    </div>
  );
}
