import { getAuthHeaders } from './session';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const authHeader = async () => {
    return getAuthHeaders();
};

const handleStatusCode = async (res) => {
    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await res.json();
    }
    return await res.text();
};

export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`);

    return handleStatusCode(res);
}

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`,
        {
            headers: await authHeader()
        }
    );

    // handle 401, 403

    return handleStatusCode(res);
}

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...await authHeader()
        },
        body: JSON.stringify(data),
    });
    return handleStatusCode(res);
}