import { validation } from "sanity";

export const banner = {
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title Image",
          type: "string",
        validation: (Rule) => Rule.required().error("Title is required"),
      },
      {
          name: "slug",
          title: "Slug",
          type: "slug",
          options: {
              source: "title",
              maxLength: 96,
          },
          validation: (Rule) =>
            Rule.required().error("Slug is required"),
      },
 
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // Enables the hotspot feature for image cropping
        },
        validation: (Rule) => Rule.required().error("Image is required"),
      },
      {
        name : "dateCreated",
          title: "Date Created",  
          type: "datetime",
          validation: (Rule) => Rule.required().error("Date Created is required"),
            
    }
  ],
};