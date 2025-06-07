export const posts = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
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
      validation: (Rule) => Rule.required().error("Slug is required"),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) =>
        Rule.required()
          .max(410)
          .error(
            "Description is required and should not exceed 300 characters"
          ),
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true, // Enables the hotspot feature for image cropping
      },
      validation: (Rule) => Rule.required().error("Image is required"),
    },
    {
      name: "imageURL",
      title: "Image URL",
      type: "url",
      description:
        "Optional : Provide a direct URL. This will override the main image.",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      validation: (Rule) => Rule.required().error("Content is required"),
    },
    {
      name: "author",
      title: "Author",
      // type: "reference",
      // to: [{ type: "author" }],
      type: "string",
      validation: (Rule) => Rule.required().error("Author is required"),
    },
    {
      name: "category",
      title: "Category",
      // type: "array",
      // of: [{ type: "reference", to: [{ type: "category" }] }],
      type: "string",
      options: {
        list: [
          { title: "Performing Arts & Entertainment", value: "arts" },
          { title: "Day Trips", value: "day-trips" },
          { title: "Events", value: "events" },
          { title: "Parks & Gardens", value: "parks" },
          { title: "Hotels", value: "hotels" },
          { title: "Landmarks", value: "landmarks" },
          { title: "Markets & Shopping ", value: "markets" },
          { title: "Museums & Galleries", value: "museums" },
          { title: "Food & Drink", value: "food-drink" },
          { title: "Sports", value: "sports" },
          { title: "Unique Tours ", value: "tours" },
          { title: "Other", value: "other" },
        ],
        // layout: "dropdown",
        layout: "radio", // Use radio buttons for selection
      },
      validation: (Rule) =>
        Rule.required().error("At least one category is required"),
    },
    {
      name: "dateCreated",
      title: "Date Created",
      type: "datetime",
      validation: (Rule) => Rule.required().error("Date Created is required"),
    },
    {
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    },
  ],
};
