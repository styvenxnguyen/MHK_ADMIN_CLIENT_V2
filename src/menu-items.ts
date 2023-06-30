const menuItems = {
  items: [
    {
      id: 'dashboard',
      title: 'Tổng quan',
      type: 'group',
      children: [
        {
          id: 'dashboard-sell',
          title: 'Bán hàng',
          type: 'item',
          icon: 'feather icon-database',
          url: '/app/dashboard/sell',
          badge: {
            title: 'Sắp ra mắt',
            type: 'label-primary'
          }
        },
        {
          id: 'dashboard-crm',
          title: 'CRM',
          type: 'item',
          icon: 'feather icon-life-buoy',
          url: '/app/dashboard/crm',
          badge: {
            title: 'Sắp ra mắt',
            type: 'label-primary'
          }
        }
      ]
    },
    {
      id: 'sell-management',
      title: 'Quản lý bán hàng',
      type: 'group',
      children: [
        {
          id: 'orders',
          title: 'Đơn hàng',
          type: 'collapse',
          icon: 'feather icon-clipboard',
          children: [
            {
              id: 'orders-create',
              title: 'Tạo đơn và giao hàng',
              type: 'item',
              url: '/app/orders/create'
            },
            {
              id: 'orders-list',
              title: 'Danh sách đơn hàng',
              type: 'item',
              url: '/app/orders'
            }
          ]
        },
        {
          id: 'deliveries',
          title: 'Vận chuyển',
          type: 'collapse',
          icon: 'feather icon-truck',
          children: [
            {
              id: 'deliveries-list',
              title: 'Danh sách đối tác',
              type: 'item',
              url: '/app/deliveries'
            }
          ]
        },
        {
          id: 'products',
          title: 'Sản phẩm',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'product-list',
              title: 'Danh sách sản phẩm',
              type: 'item',
              url: '/app/products'
            },

            {
              id: 'product-purchase-orders',
              title: 'Nhập hàng',
              type: 'item',
              url: '/app/purchase_orders'
            },
            {
              id: 'product-suppliers',
              title: 'Nhà cung cấp',
              type: 'item',
              url: '/app/suppliers'
            }
          ]
        },
        {
          id: 'customers',
          title: 'Khách hàng',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/customers'
        }
      ]
    },
    {
      id: 'advance',
      title: 'Nâng cao',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'applications',
          title: 'Ứng dụng',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/app/applications',
          badge: {
            title: 'Sắp ra mắt',
            type: 'label-primary'
          }
        },
        {
          id: 'configurations',
          title: 'Cấu hình',
          type: 'item',
          icon: 'feather icon-settings',
          url: '/app/configurations'
        }
      ]
    }
  ]
}

export default menuItems
