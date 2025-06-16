import os
import subprocess
from pathlib import Path
import openai

# === Step 1: User Input ===
print("Welcome to the AI Site Builder!")
domain = input("Enter the new website domain (e.g. example.com): ").strip()
company_name = input("Enter the company name: ").strip()
industry = input("Enter the industry/niche: ").strip()

site_folder = f"sites/{domain.replace('.', '_')}"
os.makedirs(site_folder, exist_ok=True)

# === Step 2: Scaffold Next.js Project ===
print("\n[•] Setting up Next.js starter project (this may take 1–2 min)...")
subprocess.run([
    "npx", "create-next-app@13.4.19", site_folder, "--use-npm",
    "--eslint", "--tailwind", "--typescript", "--app", "--no-git"
])
print(f"[✔] Next.js base project created.")

# === Step 3: Write site_info.txt ===
with open(f"{site_folder}/site_info.txt", "w") as f:
    f.write(f"domain: {domain}\n")
    f.write(f"company_name: {company_name}\n")
    f.write(f"industry: {industry}\n")
print(f"[✔] Created site folder and saved info: {site_folder}")

# === Step 4: Create content directory ===
content_dir = f"{site_folder}/content"
os.makedirs(content_dir, exist_ok=True)

# === Step 5: AI-Generate MDX Content ===
OPENAI_API_KEY = "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"  # <-- Change this!

site_info = {
    "company_name": company_name,
    "industry": industry,
    "domain": domain
}

pages = [
    ("home", "Home", f"Welcome to {company_name}", "/"),
    ("about", "About Us", f"About {company_name}", "/about"),
    ("services", "Our Services", f"Services from {company_name}", "/services"),
    ("contact", "Contact Us", f"Contact {company_name}", "/contact")
]

base_prompt = (
    "Write a {page_title} page for a company called {company_name}, in the {industry} sector. "
    "Make the content SEO-optimized, focused on user experience, Material Design 3, conversion, "
    "internal links to other pages (Home, About Us, Our Services, Contact Us), "
    "follow NNgroup UX and WCAG accessibility, use Markdown with headings and clear sections."
)

def ai_generate(page_key, page_title, description, slug):
    prompt = base_prompt.format(
        page_title=page_title,
        company_name=site_info['company_name'],
        industry=site_info['industry']
    )
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a world-class UX and SEO web copywriter."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
    )
    md_body = resp.choices[0].message.content.strip()
    content = f"""---
title: {page_title}
description: {description}
slug: {slug}
seo_keywords: [{site_info['industry']}, {site_info['company_name']}]
---

{md_body}
"""
    Path(f"{content_dir}/{page_key}.mdx").write_text(content, encoding="utf-8")
    print(f"[✔] AI-wrote: {content_dir}/{page_key}.mdx")

for key, title, desc, slug in pages:
    ai_generate(key, title, desc, slug)

# === Step 6: Install Dependencies ===
print(f"[•] Installing site dependencies (contentlayer, next-contentlayer, next-mdx-remote)...")
subprocess.run([
    "npm", "install", "contentlayer", "next-contentlayer", "next-mdx-remote"
], cwd=site_folder)
print(f"[✔] Installed site dependencies.")

# === Step 7: Write contentlayer.config.js ===
contentlayer_config = '''import { defineDocumentType, makeSource } from 'contentlayer/source-files'
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
'''
with open(f"{site_folder}/contentlayer.config.js", "w") as f:
    f.write(contentlayer_config)
print(f"[✔] Wrote contentlayer.config.js")

# === Step 8: Overwrite next.config.js ===
next_config = '''const { withContentlayer } = require('next-contentlayer')
module.exports = withContentlayer({})
'''
with open(f"{site_folder}/next.config.js", "w") as f:
    f.write(next_config)
print(f"[✔] Updated next.config.js")

# === Step 9: Create app/[slug]/page.tsx ===
app_dir = f"{site_folder}/app/[slug]"
os.makedirs(app_dir, exist_ok=True)
page_tsx = '''import { allPages } from 'contentlayer/generated'
import { useMDXComponent } from 'next-contentlayer/hooks'

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug.replace(/^\\//, ''),
  }))
}

export default function Page({ params }) {
  const page = allPages.find((page) => page.slug.replace(/^\\//, '') === params.slug)
  const MDXContent = useMDXComponent(page.body.code)
  return (
    <main className="prose mx-auto p-8">
      <h1>{page.title}</h1>
      <MDXContent />
    </main>
  )
}
'''
with open(f"{app_dir}/page.tsx", "w") as f:
    f.write(page_tsx)
print(f"[✔] Created app/[slug]/page.tsx")

print(f"\n[🏁] All done! Your new site is ready in: {site_folder}")
print("To preview it:")
print(f"    cd {site_folder}")
print("    npm run dev")
print("\nPages will be at /home, /about, /services, /contact (or edit slugs as needed in the .mdx files!)")

# === Step 10: Deploy to IONOS with rsync and SSH ===

# ------ SSH/SCP Settings (edit these!) ------
ionos_user = "root"  # Or your SSH user
ionos_host = "79.99.41.192"  # Your IONOS server IP
plesk_httpdocs = f"/var/www/vhosts/{domain}/httpdocs"

# Deploy with rsync (excluding node_modules, .next, out)
print("[•] Copying files to IONOS via rsync (excluding node_modules, .next, out)...")
rsync_cmd = [
    "rsync", "-av", "--delete",
    "--exclude=node_modules", "--exclude=.next", "--exclude=out",
    f"{site_folder}/", f"{ionos_user}@{ionos_host}:{plesk_httpdocs}/"
]
result = subprocess.run(rsync_cmd)
if result.returncode == 0:
    print("[✔] Site files copied to IONOS via rsync.")
else:
    print("[!] Rsync failed. Check your connection and permissions.")

# SSH to IONOS and run npm install (and optionally npm run build)
ssh_cmd = [
    "ssh",
    f"{ionos_user}@{ionos_host}",
    f"cd {plesk_httpdocs} && npm install"
]
subprocess.run(ssh_cmd)
print("[✔] npm install completed on IONOS.")

print("\n🚀 All done! Visit your domain or run 'npm run dev' (if using Node.js app hosting in Plesk).")

