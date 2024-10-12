const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
async function fetchTasks(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/tasks/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchProject(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/projects/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchCProject() {
  try {
    if (!apiDomain) {
      console.log("this is the error");
      return [];
    }
    const res = await fetch(`${apiDomain}/create-project`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchBug(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/bug/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchSingleProject(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/task-project/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchSingleBug(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/bug-project/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching bug:", error);
    return []; // Return an empty array in case of an error
  }
}
async function fetchSingleCproject(id) {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/create-project/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching cproject:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchNotifications() {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/notification`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching cproject:", error);
    return [];
  }
}
export {
  fetchTasks,
  fetchProject,
  fetchCProject,
  fetchBug,
  fetchSingleProject,
  fetchSingleBug,
  fetchSingleCproject,
  fetchNotifications,
};
