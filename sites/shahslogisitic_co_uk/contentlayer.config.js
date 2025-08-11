import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    seo_keywords: { type: "list", of: { type: "string" } },
  },
}))
export default makeSource({
  contentDirPath: "content",
  documentTypes: [Page],
})