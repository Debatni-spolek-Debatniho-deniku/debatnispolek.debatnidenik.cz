import React from "react";

interface SmartAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const isExternalUrl = (url: string): boolean => /^https?:\/\//.test(url);

const SmartAnchor: React.FC<SmartAnchorProps> = ({
  href,
  children,
  ...rest
}) => {
  const isExternal = isExternalUrl(href);

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {isExternal && <i className="bi bi-box-arrow-up-right ms-2"></i>}
    </a>
  );
};

export default SmartAnchor;
