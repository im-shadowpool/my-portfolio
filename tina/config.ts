import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "foo",
  // Get this from tina.io
  token: process.env.TINA_TOKEN || "bar",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  server: {
    allowedOrigins: ['https://devshadow.vercel.app/'],
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "portfolio",
        label: "Portfolio",
        path: "content",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "contactEmail",
            label: "Contact Email",
            required: true,
          },
          {
            type: "object",
            name: "socialLinks",
            label: "Social Links",
            fields: [
              { type: "string", name: "linkedinUrl", label: "LinkedIn URL" },
              { type: "string", name: "githubUrl", label: "GitHub URL" },
              { type: "string", name: "resumeUrl", label: "Resume URL" },
            ],
          },
          {
            type: "object",
            name: "links",
            label: "Navigation Links",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.name }),
            },
            fields: [
              { type: "string", name: "name", label: "Link Name" },
              { type: "string", name: "hash", label: "Link Hash (e.g., #about)" },
            ],
          },
          {
            type: "object",
            name: "experiences",
            label: "Experiences",
            list: true,
            ui: {
              itemProps: (item) => ({ label: `${item.title} (${item.location})` }),
            },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              {
                type: "string",
                name: "icon",
                label: "Icon Type",
                options: [
                  { label: "Work (Briefcase)", value: "work" },
                  { label: "Blog (Quill/Pen)", value: "blog" },
                  { label: "Education (Graduation Cap)", value: "education" },
                ],
              },
              { type: "string", name: "date", label: "Date Range" },
            ],
          },
          {
            type: "object",
            name: "projects",
            label: "Projects",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.title }),
            },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "string", name: "tags", label: "Tags", list: true },
              { type: "image", name: "imageUrl", label: "Project Screenshot Image" },
              { type: "string", name: "imageAlt", label: "Image Alt Text (for accessibility)" },
              { type: "string", name: "url", label: "Live Demo URL" },
              { type: "string", name: "repo", label: "Repository URL" },
              { type: "string", name: "year", label: "Year Completed" },
            ],
          },
          {
            type: "string",
            name: "skills",
            label: "Skills",
            list: true,
          },
        ],
      },
    ],
  },
});
