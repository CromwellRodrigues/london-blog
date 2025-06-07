import Comments from "@/components/Comments";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";
import Image from "next/image";
import IncrementView from "@/components/IncrementView";

export const revalidate = 60; // Revalidate every 60 seconds
// This is a server-side function to fetch blog data based on the slug

async function getBlogData(slug) {
  // from HeroData
  // this is a server-side function to fetch blog data based on the slug

  const query = `
    *[_type == "post"  && slug.current == $slug ] {
  _id,
    title,
    "slug": slug.current,
    description,
    "mainImageUrl":mainImage.asset->url,
    imageUrl,
    author,
    dateCreated,
    category,
    content
    
}  [0] 

    `;

  const data = await client.fetch(query, { slug });
  console.log("Fetched blog data app/blog/[slug] page :", data);
  return data;
}

const formatDateToLocalTime = (dateString) => {
  if (!dateString) {
    return "Invalid date";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    // timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat("en-GB", options).format(date);
};
// pass params as an argument
export default async function SelectedBlog(props) {
  const { params } = await props;
  const data = await getBlogData(params.slug);
  if (!data) {
    return <div>Post not found.</div>;
  }
  return (
    <div className="w-full  min-h-screen pt-[9vh]  text-gray-900  dark:bg-gray-900 dark:text-gray-100 ">
      <IncrementView postId={data?._id} />
      <div className="container mx-auto px-4 lg:px-8 py-12  ">
        <article className="prose prose-xl dark:prose-invert max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold leading-tight">
              {data?.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-400 mt-2">
              {formatDateToLocalTime(data?.dateCreated)} | {data?.author}
            </p>

            <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {data?.description}
            </p>
          </header>

          {data?.mainImageUrl && (
            <div className="relative w-full h-[500px] lg:h-[600px] mb-12 overflow-hidden rounded-lg shadow-lg">
              <Image
                alt={data.title}
                key={data._id}
                id={data._id}
                src={data.mainImageUrl}
                layout="fill"
                objectFit="cover"
                priority={true}
                className="rounded-lg "
              />

              <div className="absolute inset-0 bg-black/10 "></div>
            </div>
          )}

          <div className="prose prose-xl dark:prose-invert mx-auto max-w-none space-y-6">
            <PortableText value={data?.content} />
          </div>
        </article>
      </div>

      <Comments postId={data?._id} />
    </div>
  );
}
