const dataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const start = (page - 1) * perPage;
        const end = start + perPage;

        const query = new URLSearchParams({
            start: start.toString(),
            end: end.toString(),
            sort: field,
            order: order,
        }).toString();

        const url = `http://localhost:5001/api/${resource}?${query}`;

        try {
            const response = await fetch(url);
            const json = await response.json();
            const total = response.headers.get('X-Total-Count');

            return {
                data: json.data.map(item => ({
                    ...item,
                    id: item.id 
                })),
                total: total ? parseInt(total, 10) : 0,
            };
        } catch (error) {
            console.error('Error in dataProvider.getList:', error);
            return {
                data: [],
                total: 0
            };
        }
    },
};

export default dataProvider;