"use server";

import { createClient } from "../../../lib/supabase/server";
import { hasPermission } from "../../../lib/auth/permissions";

export async function deleteProject(projectId: string) {
  if (!projectId) {
    return {
      success: false,
      error: "Project ID is required.",
    };
  }

  const allowed = await hasPermission("projects.delete");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to delete projects.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Project deletion failed:", error);

    return {
      success: false,
      error: "Unable to delete project.",
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function createProject(input: {
  title: string;
  slug: string;
  description: string;
  solutionType: string;
  liveUrl: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  projectOrder: number;
}) {
  if (!input.title.trim()) {
    return {
      success: false,
      projectId: null,
      error: "Project title is required.",
    };
  }

  if (!input.slug.trim()) {
    return {
      success: false,
      projectId: null,
      error: "Project slug is required.",
    };
  }

  if (!input.description.trim()) {
    return {
      success: false,
      projectId: null,
      error: "Project description is required.",
    };
  }

  const allowed = await hasPermission("projects.create");

  if (!allowed) {
    return {
      success: false,
      projectId: null,
      error: "You do not have permission to create projects.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_admin_project",
    {
      p_title: input.title.trim(),
      p_slug: input.slug.trim(),
      p_description: input.description.trim(),
      p_category_id: null,
      p_featured: input.featured,
      p_status: input.status,
      p_live_url: input.liveUrl.trim(),
      p_solution_type: input.solutionType.trim(),
      p_project_order: input.projectOrder,
    },
  );

  if (error) {
    console.error(
      "Project creation failed:",
      error,
    );

    return {
      success: false,
      projectId: null,
      error: error.message || "Unable to create project.",
    };
  }

  return {
    success: true,
    projectId: data as string,
    error: null,
  };
}
export async function updateProject(input: {
  projectId: string;
  title: string;
  slug: string;
  description: string;
  solutionType: string;
  liveUrl: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  projectOrder: number;
}) {
  if (!input.projectId) {
    return {
      success: false,
      error: "Project ID is required.",
    };
  }

  if (!input.title.trim()) {
    return {
      success: false,
      error: "Project title is required.",
    };
  }

  if (!input.slug.trim()) {
    return {
      success: false,
      error: "Project slug is required.",
    };
  }

  if (!input.description.trim()) {
    return {
      success: false,
      error: "Project description is required.",
    };
  }

  const allowed = await hasPermission("projects.update");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to update projects.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "update_admin_project",
    {
      p_project_id: input.projectId,
      p_title: input.title.trim(),
      p_slug: input.slug.trim(),
      p_description: input.description.trim(),
      p_category_id: null,
      p_featured: input.featured,
      p_status: input.status,
      p_live_url: input.liveUrl.trim(),
      p_solution_type: input.solutionType.trim(),
      p_project_order: input.projectOrder,
    },
  );

  if (error) {
    console.error(
      "Project update failed:",
      error,
    );

    return {
      success: false,
      error: error.message || "Unable to update project.",
    };
  }

  return {
    success: true,
    error: null,
  };
}
export async function addProjectHighlight(input: {
  projectId: string;
  text: string;
  order: number;
}) {
  if (!input.projectId) {
    return {
      success: false,
      highlightId: null,
      error: "Project ID is required.",
    };
  }

  if (!input.text.trim()) {
    return {
      success: false,
      highlightId: null,
      error: "Highlight text is required.",
    };
  }

  const allowed = await hasPermission("projects.update");

  if (!allowed) {
    return {
      success: false,
      highlightId: null,
      error: "You do not have permission to update projects.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "add_admin_project_highlight",
    {
      p_project_id: input.projectId,
      p_text: input.text.trim(),
      p_order: input.order,
    },
  );

  if (error) {
    console.error(
      "Project highlight creation failed:",
      error,
    );

    return {
      success: false,
      highlightId: null,
      error:
        error.message ||
        "Unable to add project highlight.",
    };
  }

  return {
    success: true,
    highlightId: data as string,
    error: null,
  };
}


export async function deleteProjectHighlight(
  highlightId: string,
) {
  if (!highlightId) {
    return {
      success: false,
      error: "Highlight ID is required.",
    };
  }

  const allowed = await hasPermission("projects.update");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to update projects.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "delete_admin_project_highlight",
    {
      p_highlight_id: highlightId,
    },
  );

  if (error) {
    console.error(
      "Project highlight deletion failed:",
      error,
    );

    return {
      success: false,
      error:
        error.message ||
        "Unable to delete project highlight.",
    };
  }

  return {
    success: true,
    error: null,
  };
}