import { Global, css } from "@emotion/react";

const globalStyles = css`
  .EmojiPickerReact {
    --epr-hover-bg-color: #b624ffaf;
    --epr-focus-bg-color: #b624ffaf;
    --epr-highlight-color: #b624ff;
    --epr-search-border-color: #b624ff;
    --epr-category-icon-active-color: #b624ff;
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
