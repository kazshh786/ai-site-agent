import { allPages } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug.replace(/^\//, ''),
  }))
}

export default function Page({ params }) {
  const page = allPages.find((page) => page.slug.replace(/^\//, '') === params.slug)
  const MDXContent = useMDXComponent(page.body.code)
  return (
    <main className="prose mx-auto p-8">
      <h1>{page.title}</h1>
      <MDXContent />
    </main>
  )
}
