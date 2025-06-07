const exportOrdersToExcel = async (filters, ordering) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== false) {
            params.append(key, value);
        }
    });

    if (ordering) {
        params.append("ordering", ordering);
    }

    const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/orders/export-excel/?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access")}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to export Excel");
    }

    return response.blob();
};

export {exportOrdersToExcel}