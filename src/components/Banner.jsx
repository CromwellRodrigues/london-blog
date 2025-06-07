import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

async function getBannerData() {
    const query = `
        *[_type == "banner" ] {
  title,
    "current_slug": slug.current,
    image,
    dateCreated
    
}[0]
    `

    
const data = await client.fetch(query);
return data;
}



export default async function Banner() {

    const data = await getBannerData();

    return (
        <div className="relative w-full h-[80vh] overflow-hidden pt-[7vh md:pt-0 ">
            <Image src={urlFor(data.image).url()}
                alt={data.current_slug}
                // width={1920}
            // height={700}
                fill
                sizes = '100vw'
                style={{
                    objectFit: "object-cover md:object-contain object-center",
                    objectPosition: "center bottom",
                 }}
                // className="w-full h-[70vh] object-cover"
                priority={true}
            />
        </div>
    )
}