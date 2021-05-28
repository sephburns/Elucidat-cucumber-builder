const API_BASE_URL = 'http://localhost:3000';

const getTests = () => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    );
}

const createTest = ({
    name,
    body,
}) => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                body
            })
        })
    );
}

const updateTest = (id, {
    name,
    body,
}) => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                body
            })
        })
    );
}

const getTest = id => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    );
}

const deleteTest = id => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    );
}

const makeRequest = async request => {
    try {
        const res = await request();

        if (!res.ok) {
            throw new Error(res.statusText ?? 'Request failed');
        }

        return res.json();
    } catch (e) {
        alert(e);
    }
}