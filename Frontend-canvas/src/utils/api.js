// code for fetch to update the canvas elements
const updateCanvasElements = async (canvasId, elements) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`https://backend-2-opa9.onrender.com/canvas/${canvasId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ elements })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update canvas elements');
        }

        return response.json();
    } catch (error) {
        console.error('Error updating canvas elements:', error);
        throw error;
    }
}

export default updateCanvasElements;        

