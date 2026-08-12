import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AdSlot } from "./AdSlot";

const BLOCKS_PER_CHUNK = 3;

function chunkContent(markdown: string): string[] {
  const blocks = markdown.split(/\n{2,}/).filter((b) => b.trim().length > 0);
  const chunks: string[] = [];
  for (let i = 0; i < blocks.length; i += BLOCKS_PER_CHUNK) {
    chunks.push(blocks.slice(i, i + BLOCKS_PER_CHUNK).join("\n\n"));
  }
  return chunks;
}

export function ArticleContent({ content }: { content: string }) {
  const chunks = chunkContent(content);

  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:text-brand">
      {chunks.map((chunk, i) => (
        <div key={i}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{chunk}</ReactMarkdown>
          {i < chunks.length - 1 && (
            <div className="not-prose my-6">
              <AdSlot position="in-article" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
