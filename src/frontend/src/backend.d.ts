import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    publishedDate: bigint;
    published: boolean;
    tags: Array<string>;
    summary: string;
}
export interface ContactMessage {
    id: string;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface Skill {
    id: string;
    name: string;
    proficiency: bigint;
    category: string;
}
export interface AboutSection {
    title: string;
    name: string;
    description: string;
    profileImageUrl: string;
}
export interface Project {
    id: string;
    title: string;
    featured: boolean;
    viewPassword?: string;
    description: string;
    githubUrl: string;
    imageUrl: string;
    demoUrl: string;
    techStack: Array<string>;
    demoPassword?: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(post: BlogPost): Promise<void>;
    createProject(project: Project): Promise<void>;
    createSkill(skill: Skill): Promise<void>;
    deleteBlogPost(id: string): Promise<void>;
    deleteContactMessage(id: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    deleteSkill(id: string): Promise<void>;
    getAboutSection(): Promise<AboutSection>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllSkills(): Promise<Array<Skill>>;
    getBlogPost(id: string): Promise<BlogPost>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(id: string): Promise<Project>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactMessage(message: ContactMessage): Promise<void>;
    updateAboutSection(about: AboutSection): Promise<void>;
    updateBlogPost(post: BlogPost): Promise<void>;
    updateProject(project: Project): Promise<void>;
    updateSkill(skill: Skill): Promise<void>;
}
