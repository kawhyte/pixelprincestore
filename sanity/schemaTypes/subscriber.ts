import { defineType, defineField } from "sanity";

export const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  readOnly: true, // managed by the API, not hand-edited
  fields: [
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "consentAt", title: "Consented At", type: "datetime" }),
    defineField({ name: "source", title: "Signup Source", type: "string" }),
    defineField({
      name: "downloads",
      title: "Download History",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "artId", type: "string" },
          { name: "sizeId", type: "string" },
          { name: "requestedAt", type: "datetime" },
        ],
      }],
    }),
  ],
  preview: { select: { title: "email", subtitle: "source" } },
});
