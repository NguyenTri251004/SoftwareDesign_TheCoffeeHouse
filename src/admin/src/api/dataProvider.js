const API_URL = "http://localhost:5001/api";

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

        const response = await fetch(`${API_URL}/${resource}?${query}`);
        const json = await response.json();
        const total = response.headers.get('X-Total-Count');

        return {
            data: (json.data || []).map(item => ({
                ...item,
                id: item.id || item._id, 
            })),
            total: total ? parseInt(total, 10) : 0,
        };
    },

    getMany: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/many`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: params.ids }),
    });

    const json = await response.json();

    const dataWithId = (json.data || []).map(item => ({
        ...item,
        id: item.id || item._id, 
    }));

    return { data: dataWithId };
},
   

getOne: async (resource, params) => {
    try {
        const response = await fetch(`${API_URL}/${resource}/${params.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        const item = json.data || json.shop; // phòng trường hợp dùng nhầm getShopById
        return {
            data: {
                ...item,
                id: item.id || item._id, // ✅ đảm bảo có id
            },
        };
    } catch (error) {
        console.error('Error in dataProvider.getOne:', error);
        throw error;
    }
},


    create: async (resource, params) => {
        let data = { ...params.data };
        if (resource === 'admin') {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify({
                    ...params.data,
                    password: 'thecoffeehouse',
                    role: 'admin', 
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            
            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'Tạo admin thất bại');
            }
            
            return {
                data: {
                    ...params.data,
                    id: json.id,
                }
            };
        }
        
        if (resource === 'shop') {
            const convertToBase64 = (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
        
            data.images = await Promise.all(
                (data.images || []).map(async (imgObj) => {
                    if (!imgObj) return '';
                    if (typeof imgObj === 'string') return imgObj;
                    if (imgObj?.rawFile) return await convertToBase64(imgObj.rawFile);
                    if (imgObj?.src) return imgObj.src;
                    return '';
                })
            ).then(arr => arr.filter(Boolean));
        }
        

        const response = await fetch(`${API_URL}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
    
        const json = await response.json();
        return {
            data: {
                ...json,
                id: json._id || json.id,
            },
        };
    },

    update: async (resource, params) => {
        const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
    
        const updatedData = json.data;
    
        return {
            data: {
                ...updatedData,
                id: updatedData._id || params.id, 
            }
        };
    },
    

    delete: async (resource, params) => {
        const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
            method: 'DELETE',
        });
        const json = await response.json();
        return { data: json.data };
    },
};

export default dataProvider;