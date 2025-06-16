import { defineDocumentType, makeSource } from 'contentlayer/source-files'
export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    slug: { type: 'string', required: true },
    seo_keywords: { type: 'string', required: false },
    contentType: { type: 'mdx' },
  },
}))
export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Page],
})
