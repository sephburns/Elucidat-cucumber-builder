const API_BASE_URL = 'http://localhost:3000';

const getTests = () => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests`)
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

const deleteTest = ({
    id,
}) => {
    return makeRequest(
        () => fetch(`${API_BASE_URL}/tests/`, {
            method: 'DELETE',
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

const makeRequest = async request => {
    try {
        const res = await request();

        if (!res.ok) {
            throw new Error(res.statusText ?? 'Request failed');
        }

        alert('request completed successfully');

        return res;
    } catch (e) {
        alert(e);
    }
}