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
          url: '/app/dashboard/sell'
        },
        {
          id: 'dashboard-crm',
          title: 'CRM',
          type: 'item',
          icon: 'feather icon-life-buoy',
          url: '/app/dashboard/crm'
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
              id: 'order-create',
              title: 'Tạo đơn và giao hàng',
              type: 'item',
              url: '/app/sell-management/orders/create'
            },
            {
              id: 'order-list',
              title: 'Danh sách đơn hàng',
              type: 'item',
              url: '/app/sell-management/orders/'
            },
            {
              id: 'order-return',
              title: 'Khách trả hàng',
              type: 'item',
              url: '/basic/alert'
            }
          ]
        },
        {
          id: 'delievery',
          title: 'Vận chuyển',
          type: 'collapse',
          icon: 'feather icon-truck',
          children: [
            {
              id: 'delievery-dashboard',
              title: 'Tổng quan',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'delievery-order-management',
              title: 'Quản lý vận đơn',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'delievery-check-cost',
              title: 'Đối soát COD và phí',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'delievery-connect-partner',
              title: 'Kết nối đối tác',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'delievery-config',
              title: 'Cấu hình giao hàng',
              type: 'item',
              url: '/basic/alert'
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
              url: '/app/sell-management/products'
            },
            {
              id: 'product-inventory',
              title: 'Quản lý kho',
              type: 'item',
              url: '/app/sell-management'
            },
            {
              id: 'product-import-order',
              title: 'Đặt hàng nhập',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'product-import',
              title: 'Nhập hàng',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'product-check',
              title: 'Kiểm hàng',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'product-shipping',
              title: 'Chuyển hàng',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'product-supplier',
              title: 'Nhà cung cấp',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'product-price-adjust',
              title: 'Điều chỉnh giá vốn',
              type: 'item',
              url: '/basic/alert'
            }
          ]
        },
        {
          id: 'cash-book',
          title: 'Sổ quỹ',
          type: 'collapse',
          icon: 'feather icon-dollar-sign',
          children: [
            {
              id: 'receipts-bill',
              title: 'Phiếu thu',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'payment-bill',
              title: 'Phiếu chi',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'cashbook',
              title: 'Sổ quỹ',
              type: 'item',
              url: '/basic/alert'
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
          url: '/app/application'
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
