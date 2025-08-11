import React from 'react';
import fs from 'fs';
import path from 'path';

// --- Component Imports ---
// Statically import all possible components that the blueprint can reference.
// The build process will tree-shake and only include the ones actually used.
import HeroSection1 from '@/components/HeroSection1';
import FeatureGrid3 from '@/components/FeatureGrid3';
import ContactForm1 from '@/components/ContactForm1';
import Placeholder from '@/components/Placeholder';
// Add all other possible components here...
// e.g., import TeamSection1 from '@/components/TeamSection1';

// --- Component Map ---
// This map links the string name from the JSON blueprint to the actual React component.
// We use 'any' because each component has different props, which is expected.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: { [key: string]: React.ComponentType<any> } = {
  HeroSection1,
  FeatureGrid3,
  ContactForm1,
  // Add other components here...
  // TeamSection1,
};

// --- Type Definitions ---
// These interfaces define the expected structure of our blueprint.json file.
interface ComponentData {
  component_name: string;
  props: Record<string, unknown>;
}

interface SiteBlueprint {
  client_name: string;
  industry: string;
  pages: {
    [key: string]: ComponentData[];
  };
  // Add other top-level blueprint properties if needed
}

interface PageProps {
  params: {
    slug: string[];
  };
}

// --- Data Fetching ---
// This function runs on the server to read the blueprint file from disk.
async function getBlueprint(): Promise<SiteBlueprint> {
  // Read the target site directory from an environment variable.
  const siteDirectory = process.env.SITE_DIRECTORY;

  // Check if the environment variable is set. If not, we cannot proceed.
  if (!siteDirectory) {
    console.error("FATAL: SITE_DIRECTORY environment variable is not set.");
    // Return a clear error state for the page to display.
    return { 
        client_name: "Configuration Error", 
        industry: "No Site Specified", 
        pages: { 
            home: [{
                component_name: "Placeholder",
                props: { component_name: "FATAL ERROR: SITE_DIRECTORY environment variable is not set. Please configure the server." }
            }]
        } 
    };
  }

  // Construct the dynamic file path.
  const filePath = path.join(process.cwd(), '..', 'sites', siteDirectory, 'blueprint.json');
  
  try {
    const jsonData = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData) as SiteBlueprint;
  } catch (error) {
    console.error(`Failed to read or parse blueprint.json for site "${siteDirectory}":`, error);
    // Return a fallback structure to prevent the page from crashing
    return { 
        client_name: "Error", 
        industry: `Could not load site: ${siteDirectory}`, 
        pages: { home: [] } 
    };
  }
}

// --- The Dynamic Page Component ---
// This is the main component that Next.js will render for every page.
export default async function Page({ params }: PageProps) {
  const blueprint = await getBlueprint();
  
  // Determine the current page from the URL slug.
  // e.g., /about -> 'about', / -> 'home'
  const pageKey = params.slug ? params.slug.join('/') : 'home';
  const componentsToRender = blueprint.pages[pageKey] || [];

  if (componentsToRender.length === 0 && pageKey !== 'home') {
    return (
        <div className="container mx-auto my-12 text-center">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                The page '{pageKey}' could not be found in the site blueprint.
            </p>
        </div>
    );
  }

  return (
    <main>
      {componentsToRender.map((componentData, index) => {
        const Component = componentMap[componentData.component_name];

        if (!Component) {
          // Render a placeholder if the component name is unknown
          return <Placeholder key={index} component_name={componentData.component_name} />;
        }

        return <Component key={index} {...componentData.props} />;
      })}
    </main>
  );
}

// --- Static Site Generation (Optional but Recommended) ---
// This function tells Next.js which pages to pre-build at build time.
export async function generateStaticParams() {
    const blueprint = await getBlueprint();
    const pages = Object.keys(blueprint.pages);

    return pages.map(page => ({
        slug: page === 'home' ? [] : [page],
    }));
}
