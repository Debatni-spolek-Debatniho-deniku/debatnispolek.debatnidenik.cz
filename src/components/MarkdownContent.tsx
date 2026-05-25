import React from "react";
import parse, {
  attributesToProps,
  domToReact,
  Element,
  DOMNode,
  HTMLReactParserOptions,
} from "html-react-parser";
import SmartAnchor from "./SmartAnchor";

interface MarkdownContentProps {
  html: string;
  className?: string;
}

const options: HTMLReactParserOptions = {
  replace: (node) => {
    if (node instanceof Element && node.name === "a") {
      const { href, ...rest } = attributesToProps(node.attribs);
      if (typeof href !== "string") return undefined;
      return (
        <SmartAnchor href={href} {...rest}>
          {domToReact(node.children as DOMNode[], options)}
        </SmartAnchor>
      );
    }
    return undefined;
  },
};

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  html,
  className,
}) => <div className={className}>{parse(html, options)}</div>;

export default MarkdownContent;
