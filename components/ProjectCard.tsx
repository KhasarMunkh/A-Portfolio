import Link from "next/link";
import Image from "next/image";
import { FaTags } from "react-icons/fa";
import { getTagColor } from "@/lib/tags";

interface ProjectCardProps {
  slug: string;
  image: { src: string; alt: string };
  title: string;
  description: string;
  tags: string[];
}

export default function ProjectCard({
  slug,
  image,
  title,
  description,
  tags,
}: ProjectCardProps) {
  return (
    <article>
      <Link
        href={`/projects/${slug}`}
        className="
        grid grid-rows-[auto_1fr_auto]
        overflow-hidden
        p-4
        rounded-xl
        border-2
        border-surface1
        transition-color duration-200 ease-out hover:border-pink
        transition-transform hover:scale-[1.01] 
        focus-visible:border-pink focus-visible:outline-none
      "
      >
        <div className="rounded-lg bg-base overflow-hidden">
          {/* Row 1: Image*/}
          <figure className="relative aspect-video w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </figure>

          {/* Row 2: Title + description */}
          <div className="flex flex-col p-4 pb-0">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-subtext1 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Row 3: Tags */}
          {tags.length > 0 && (
            <div className="flex max-h-8 gap-2 p-4 flex-wrap overflow-hidden pt-3 text-xs items-center">
              <FaTags className="text-teal shrink-0" />
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 rounded-sm bg-surface2 whitespace-nowrap ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
