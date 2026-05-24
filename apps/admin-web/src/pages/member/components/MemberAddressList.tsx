import { List, Tag, Typography } from 'antd';

import type { MemberAddress } from '../types';

interface MemberAddressListProps {
  addresses: MemberAddress[];
}

export default function MemberAddressList({ addresses }: MemberAddressListProps) {
  if (addresses.length === 0) {
    return <Typography.Text type="secondary">暂无收货地址</Typography.Text>;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={addresses}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={
              <span>
                {item.receiver} {item.phone}
                {item.isDefault && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    默认地址
                  </Tag>
                )}
              </span>
            }
            description={item.address}
          />
        </List.Item>
      )}
    />
  );
}
