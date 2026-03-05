import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AboutSection,
  BlogPost,
  ContactMessage,
  Project,
  Skill,
} from "../backend.d";
import { useActor } from "./useActor";

// ── About ──────────────────────────────────────────────────────────────────

export function useAboutSection() {
  const { actor, isFetching } = useActor();
  return useQuery<AboutSection>({
    queryKey: ["about"],
    queryFn: async () => {
      if (!actor)
        return { title: "", name: "", description: "", profileImageUrl: "" };
      return actor.getAboutSection();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAbout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (about: AboutSection) => {
      if (!actor) throw new Error("No actor");
      return actor.updateAboutSection(about);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about"] }),
  });
}

// ── Projects ────────────────────────────────────────────────────────────────

export function useProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Project) => {
      if (!actor) throw new Error("No actor");
      return actor.createProject(project);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Project) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProject(project);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProject(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

// ── Skills ──────────────────────────────────────────────────────────────────

export function useSkills() {
  const { actor, isFetching } = useActor();
  return useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSkills();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSkill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skill: Skill) => {
      if (!actor) throw new Error("No actor");
      return actor.createSkill(skill);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
}

export function useUpdateSkill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skill: Skill) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSkill(skill);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
}

export function useDeleteSkill() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSkill(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });
}

// ── Blog Posts ───────────────────────────────────────────────────────────────

export function useBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: BlogPost) => {
      if (!actor) throw new Error("No actor");
      return actor.createBlogPost(post);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: BlogPost) => {
      if (!actor) throw new Error("No actor");
      return actor.updateBlogPost(post);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });
}

// ── Contact Messages ─────────────────────────────────────────────────────────

export function useContactMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: (message: ContactMessage) => {
      if (!actor) throw new Error("No actor");
      return actor.submitContactMessage(message);
    },
  });
}

export function useDeleteContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteContactMessage(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });
}

// ── Admin Check ──────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
