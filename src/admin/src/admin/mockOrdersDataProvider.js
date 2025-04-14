import dataProvider from '../api/dataProvider.js';

const mockOrders = [
  {
    id: 'ord001',
    deliveryAddress: '123 Lê Lợi, Q.1',
    phone: '0909123456',
    totalAmount: 120000,
    status: 'Pending',
    refundStatus: 'None',
    createdAt: new Date(),
    items: [
      {
        productName: 'Trà sữa trân châu',
        size: 'M',
        quantity: 2,
        unitPrice: 30000,
        totalPrice: 60000,
        toppings: [
          { toppingName: 'Trân châu', quantity: 1 },
          { toppingName: 'Thạch phô mai', quantity: 1 }
        ]
      }
    ]
  }
];

const customProvider = {
  ...dataProvider,
  getList: (resource, params) => {
    if (resource === 'orders') {
      return Promise.resolve({
        data: mockOrders,
        total: mockOrders.length
      });
    }
    return dataProvider.getList(resource, params);
  },

  getOne: (resource, params) => {
    if (resource === 'orders') {
      const found = mockOrders.find(o => o.id === params.id);
      return Promise.resolve({ data: found });
    }
    return dataProvider.getOne(resource, params);
  },

  update: (resource, params) => {
    if (resource === 'orders') {
      return Promise.resolve({ data: params.data });
    }
    return dataProvider.update(resource, params);
  },
};

export default customProvider;
