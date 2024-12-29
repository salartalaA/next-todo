"use server";

import { cookies } from "next/headers";

function handleError(message) {
  const errors = [];
  console.log(message);

  if (typeof message === "object") {
    Object.keys(message).forEach((key) => {
      console.log(message[key]);
      errors.push(message[key]);
    });
  } else {
    errors.push(message);
  }

  return errors.join(", ");
}

async function register(state, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch("http://localhost:3004/api/users/register", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    return {
      success: "Signup successful",
    };
  } else {
    return {
      error: handleError(data),
    };
  }
}

async function login(state, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch("http://localhost:3004/api/users/login", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: data.token,
      httpOnly: true,
    });
    return {
      success: "Login successful",
      user: data.user,
    };
  } else {
    return {
      error: handleError(data),
    };
  }
}

async function me() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return {
      error: "User not found",
    };
  }

  const res = await fetch("http://localhost:3004/api/users/userInfo", {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const data = await res.json();
  if (res.ok) {
    return {
      user: data.user,
    };
  } else {
    return {
      error: "User not found",
    };
  }
}

async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return {
      error: "No token found, already logged out.",
    };
  }

  const res = await fetch("http://localhost:3004/api/users/logout", {
    cache: "no-store",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();

  if (res.ok) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return {
      success: "Logged out successfully",
    };
  } else {
    return {
      error: handleError(data),
    };
  }
}

export { register, login, me, logout };
