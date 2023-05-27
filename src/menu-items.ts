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
              url: '/app/sell-management/orders/create'
            },
            {
              id: 'orders-list',
              title: 'Danh sách đơn hàng',
              type: 'item',
              url: '/app/orders/'
            },
            // {
            //   id: 'order-return',
            //   title: 'Khách trả hàng',
            //   type: 'item',
            //   url: '/basic/alert'
            // }
          ]
        },
        // {
        //   id: 'delievery',
        //   title: 'Vận chuyển',
        //   type: 'collapse',
        //   icon: 'feather icon-truck',
        //   children: [
        //     {
        //       id: 'delievery-dashboard',
        //       title: 'Tổng quan',
        //       type: 'item',
        //       url: '/basic/alert'
        //     },
        //     {
        //       id: 'delievery-order-management',
        //       title: 'Quản lý vận đơn',
        //       type: 'item',
        //       url: '/basic/alert'
        //     },
        //     {
        //       id: 'delievery-check-cost',
        //       title: 'Đối soát COD và phí',
        //       type: 'item',
        //       url: '/basic/alert'
        //     },
        //     {
        //       id: 'delievery-connect-partner',
        //       title: 'Kết nối đối tác',
        //       type: 'item',
        //       url: '/basic/alert'
        //     },
        //     {
        //       id: 'delievery-config',
        //       title: 'Cấu hình giao hàng',
        //       type: 'item',
        //       url: '/basic/alert'
        //     }
        //   ]
        // },
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
            }
          ]
        },
        // {
        //   id: 'cash-book',
        //   title: 'Sổ quỹ',
        //   type: 'collapse',
        //   icon: 'feather icon-dollar-sign',
        //   children: [
        //     {
        //       id: 'receipts-bill',
        //       title: 'Phiếu thu',
        //       type: 'item',
        //       url: '/basic/alert'
        //     }
        //   ]
        // },
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
          url: '/app/applications'
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
