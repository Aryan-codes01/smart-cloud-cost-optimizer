const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function handleResponse(response) {
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

export async function fetchDashboard({ role, cloud }) {
  const response = await fetch(
    `${API_BASE_URL}/dashboard?role=${role}&cloud=${cloud}`,
    {
      headers: {
        "x-user-role": role,
      },
    }
  );

  return handleResponse(response);
}

export async function uploadBillingFile({ file, strategy, role }) {
  const formData = new FormData();
  formData.append("billingFile", file);
  formData.append("strategy", strategy);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    headers: {
      "x-user-role": role,
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function syncProvider({ provider, role }) {
  const response = await fetch(`${API_BASE_URL}/providers/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-role": role,
    },
    body: JSON.stringify({ provider }),
  });

  return handleResponse(response);
}

export async function executeAction({ actionId, role }) {
  const response = await fetch(`${API_BASE_URL}/actions/${actionId}/execute`, {
    method: "POST",
    headers: {
      "x-user-role": role,
    },
  });

  return handleResponse(response);
}
