import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Re-exports
  type Project = {
    id : Text;
    title : Text;
    description : Text;
    techStack : [Text];
    imageUrl : Text;
    demoUrl : Text;
    githubUrl : Text;
    featured : Bool;
    demoPassword : ?Text;
    viewPassword : ?Text;
  };

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Text.compare(project1.title, project2.title);
    };
  };

  type Skill = {
    id : Text;
    name : Text;
    category : Text;
    proficiency : Nat;
  };

  type BlogPost = {
    id : Text;
    title : Text;
    summary : Text;
    content : Text;
    publishedDate : Int;
    tags : [Text];
    published : Bool;
  };

  module BlogPost {
    public func compare(blogPost1 : BlogPost, blogPost2 : BlogPost) : Order.Order {
      Text.compare(blogPost1.title, blogPost2.title);
    };
  };

  type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    timestamp : Int;
  };

  type AboutSection = {
    name : Text;
    title : Text;
    description : Text;
    profileImageUrl : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Prefabricated authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage
  let projects = Map.empty<Text, Project>();
  let skills = Map.empty<Text, Skill>();
  let blogPosts = Map.empty<Text, BlogPost>();
  let contactMessages = Map.empty<Text, ContactMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var aboutSection : ?AboutSection = ?{
    name = "Navneet Singh";
    title = "Software Engineer";
    description = "Passionate developer with experience in web and blockchain technologies.";
    profileImageUrl = "";
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Projects - Public Read
  public query func getProject(id : Text) : async Project {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  public query func getAllProjects() : async [Project] {
    projects.values().toArray().sort();
  };

  // Skills - Public Read
  public query func getAllSkills() : async [Skill] {
    skills.values().toArray();
  };

  // Blog Posts - Public Read
  public query func getBlogPost(id : Text) : async BlogPost {
    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) { post };
    };
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort();
  };

  // About Section - Public Read
  public query func getAboutSection() : async AboutSection {
    switch (aboutSection) {
      case (null) { Runtime.trap("About section not found") };
      case (?about) { about };
    };
  };

  // Projects Admin-only
  public shared ({ caller }) func createProject(project : Project) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };
    projects.add(project.id, project);
  };

  public shared ({ caller }) func updateProject(project : Project) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };
    switch (projects.get(project.id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        projects.add(project.id, project);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        projects.remove(id);
      };
    };
  };

  // Skills Admin-only
  public shared ({ caller }) func createSkill(skill : Skill) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create skills");
    };
    skills.add(skill.id, skill);
  };

  public shared ({ caller }) func updateSkill(skill : Skill) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update skills");
    };
    switch (skills.get(skill.id)) {
      case (null) { Runtime.trap("Skill not found") };
      case (?_) {
        skills.add(skill.id, skill);
      };
    };
  };

  public shared ({ caller }) func deleteSkill(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete skills");
    };
    switch (skills.get(id)) {
      case (null) { Runtime.trap("Skill not found") };
      case (?_) {
        skills.remove(id);
      };
    };
  };

  // Blog Posts Admin-only
  public shared ({ caller }) func createBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    switch (blogPosts.get(post.id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?_) {
        blogPosts.add(post.id, post);
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?_) {
        blogPosts.remove(id);
      };
    };
  };

  // About Section Admin-only
  public shared ({ caller }) func updateAboutSection(about : AboutSection) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update the about section");
    };
    aboutSection := ?about;
  };

  // Contact Messages - Anyone can submit
  public shared ({ caller }) func submitContactMessage(message : ContactMessage) : async () {
    contactMessages.add(message.id, message);
  };

  // Contact Messages - Admin only read/delete
  public query ({ caller }) func getAllContactMessages() : async [ContactMessage] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contactMessages.values().toArray();
  };

  public shared ({ caller }) func deleteContactMessage(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete contact messages");
    };
    switch (contactMessages.get(id)) {
      case (null) { Runtime.trap("Contact message not found") };
      case (?_) {
        contactMessages.remove(id);
      };
    };
  };
};
