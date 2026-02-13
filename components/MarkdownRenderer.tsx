"use client";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ id, children }) => (
    <h1 id={id} className="text-3xl font-bold text-accent mb-4 mt-8 first:mt-0 scroll-mt-20">
      {children}
    </h1>
  ),
  h2: ({ id, children }) => (
    <h2 id={id} className="text-2xl font-semibold text-accent mb-3 mt-8 scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3 id={id} className="text-xl font-medium text-accent mb-2 mt-6 scroll-mt-20">
      {children}
    </h3>
  ),
  h4: ({ id, children }) => (
    <h4 id={id} className="text-lg font-medium text-accent mb-2 mt-4 scroll-mt-20">
      {children}
    </h4>
  ),
  h5: ({ id, children }) => (
    <h5 id={id} className="text-base font-medium text-accent mb-1 mt-4 scroll-mt-20">
      {children}
    </h5>
  ),
  h6: ({ id, children }) => (
    <h6 id={id} className="text-sm font-medium text-accent mb-1 mt-4 scroll-mt-20">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="text-text mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-accent underline underline-offset-2 decoration-accent/50 hover:decoration-accent transition-colors duration-200"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-text">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-text">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-text leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent/50 pl-4 my-4 text-subtext0 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`${className} text-sm`}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-surface0 text-text rounded px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-mantle rounded-lg p-4 mb-4 overflow-x-auto text-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b-2 border-surface1">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-surface0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="text-left py-2 px-3 font-semibold text-text">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="py-2 px-3 text-subtext1">{children}</td>
  ),
  hr: () => <hr className="border-surface1 my-8" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="rounded-lg max-w-full h-auto my-4"
    />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-text">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-subtext0">{children}</em>,
  del: ({ children }) => (
    <del className="text-overlay1 line-through">{children}</del>
  ),
  input: ({ checked, ...rest }) => (
    <input
      type="checkbox"
      checked={checked}
      readOnly
      className="mr-2 accent-accent"
      {...rest}
    />
  ),
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
