import * as React from "react";
import type { GatsbySSR } from "gatsby";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setPostBodyComponents,
}) => {
  setPostBodyComponents([
    <script
      key="cloudflare-analytics"
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "372138b2d9ac4fc288f18cc2216be070"}'
    />,
  ]);
};
