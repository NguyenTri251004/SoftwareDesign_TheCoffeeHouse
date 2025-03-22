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

        const url = `http://localhost:5001/api/${resource}?${query}`;;
        const response = await fetch(url);
        const json = await response.json();
        const total = response.headers.get('X-Total-Count');

        return {
            data: json.data.map(item => ({ ...item, id: item.id })),
            total: total ? parseInt(total, 10) : 0,
        };
    },

    getOne: async (resource, params) => {
        const url = `http://localhost:5001/api/${resource}/${params.id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            return { data: { ...json, id: json.id } };
        } catch (error) {
            console.error('Error in dataProvider.getOne:', error);
            throw error;
        }
    },

    create: async (resource, params) => {
        const response = await fetch(`http://localhost:5001/api/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        return { data: { ...json, id: json.id } };
    },

    update: async (resource, params) => {
        const response = await fetch(`http://localhost:5001/api/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        return { data: { ...json, id: json.id } };
    },

    delete: async (resource, params) => {
        const response = await fetch(`http://localhost:5001/api/${resource}/${params.id}`, {
            method: 'DELETE',
        });
        const json = await response.json();
        return { data: { ...json, id: json.id } };
    },
};

export default dataProvider;