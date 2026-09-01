import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import "./ContentSection.css";

// Content editors embed the section image directly in the rich text field
// (Insert Media). This pulls that first embedded asset out so it can be
// rendered as the standalone image column, and richTextOptions below hides
// it from the inline text flow so it isn't shown twice.
function findEmbeddedAsset(document?: Document) {
  const assetNode = document?.content.find((node) => node.nodeType === BLOCKS.EMBEDDED_ASSET);
  const target = (assetNode?.data as { target?: unknown } | undefined)?.target;
  if (target && typeof target === "object" && "fields" in target) {
    return target as { fields: { file?: { url?: string }; title?: string } };
  }
  return undefined;
}

const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: () => null,
  },
};

interface ContentSectionProps {
  status: "loading" | "ready" | "error";
  hasEntry: boolean;
  content?: Document;
  fallbackAlt?: string;
}

export default function ContentSection({ status, hasEntry, content, fallbackAlt }: ContentSectionProps) {
  const contentAsset = findEmbeddedAsset(content);
  const contentImageUrl = contentAsset?.fields.file?.url;
  const contentImageAlt = contentAsset?.fields.title ?? fallbackAlt;

  return (
    <section className="content-section">
      <div className="content-section__inner">
        {contentImageUrl && (
          <img
            className="content-section__image"
            src={`https:${contentImageUrl}`}
            alt={contentImageAlt}
          />
        )}

        <div className="content-section__body">
          {status === "loading" && <p>Loading content…</p>}
          {status === "error" && (
            <p>
              Couldn't load content from Contentful. Check your{" "}
              <code>VITE_CONTENTFUL_SPACE_ID</code> and{" "}
              <code>VITE_CONTENTFUL_ACCESS_TOKEN</code> in <code>.env</code>.
            </p>
          )}
          {status === "ready" && !hasEntry && (
            <p>
              No <code>homePage</code> entry found yet — publish one in Contentful to see it
              here.
            </p>
          )}
          {content && documentToReactComponents(content, richTextOptions)}
        </div>
      </div>
    </section>
  );
}
