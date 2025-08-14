import dynamic from 'next/dynamic';

// Type Definitions (Provided by the user, extended for blueprint details)
interface Component {
  component_name: string;
  props: Record<string, unknown>; // Use 'unknown' instead of 'any' for props
  componentContent?: string;
  componentType?: string;
  componentStyles?: string;
  componentInteractivity?: string;
  componentName?: string; // For global components in the blueprint
}

interface Section {
  section_name: string;
  heading: string | null; // Always null in the provided blueprint, using section_name instead
  components: Component[];
  sectionName?: string;
  layoutType?: string;
  componentAlignment?: string;
  designNotes?: string;
}

interface Page {
  page_name: string;
  page_path: string;
  sections: Section[];
  pageName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface Blueprint {
  client_name: string;
  pages: Page[];
  design_system: unknown | null;
  siteName: string;
  industry: string;
  branding: Record<string, unknown>;
  globalComponents: Component[];
}

// Site Blueprint (Provided by the user)
const siteBlueprint: Blueprint = {
  "client_name": "Shahs Logistics",
  "pages": [
    {
      "page_name": "Homepage",
      "page_path": "/",
      "sections": [
        {
          "section_name": "Hero Section",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Your Global Logistics Partner",
              "componentStyles": "h1-text, Poppins-font, White-color",
              "componentInteractivity": "Fade-in on load"
            },
            {
              "component_name": "Sub-heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Sub-heading",
              "componentType": "Text",
              "componentContent": "Fast, Reliable, and Hassle-Free",
              "componentStyles": "p-text-large, Open-Sans-font, Light-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Button",
              "component_type": "Button",
              "props": {},
              "componentName": "Button",
              "componentType": "Button",
              "componentContent": "Get a Quote",
              "componentStyles": "Primary-btn, Rounded-corners, Orange-background",
              "componentInteractivity": "On-hover scale, On-click navigate to /quote"
            }
          ],
          "sectionName": "Hero Section",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Large background image of a truck at sunset, dark overlay, white text, bold headlines."
        },
        {
          "section_name": "About Us Overview",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Who We Are",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Paragraph",
              "component_type": "Text",
              "props": {},
              "componentName": "Paragraph",
              "componentType": "Text",
              "componentContent": "Shahs Logistics has been at the forefront of the logistics industry for over two decades, committed to providing top-notch services with a focus on customer satisfaction.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Image",
              "component_type": "Image",
              "props": {},
              "componentName": "Image",
              "componentType": "Image",
              "componentContent": "/assets/shahs_team.jpg",
              "componentStyles": "Full-width, Aspect-ratio-16-9",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "About Us Overview",
          "layoutType": "Two-column",
          "componentAlignment": "Left",
          "designNotes": "Text on left, image on right, light background, padding."
        },
        {
          "section_name": "Services Showcase",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Our Services",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Service Card 1",
              "component_type": "Card",
              "props": {},
              "componentName": "Service Card 1",
              "componentType": "Card",
              "componentContent": "Freight Forwarding",
              "componentStyles": "Card-primary, Icon-top, Text-center",
              "componentInteractivity": "On-hover elevate"
            },
            {
              "component_name": "Service Card 2",
              "component_type": "Card",
              "props": {},
              "componentName": "Service Card 2",
              "componentType": "Card",
              "componentContent": "Warehousing",
              "componentStyles": "Card-primary, Icon-top, Text-center",
              "componentInteractivity": "On-hover elevate"
            },
            {
              "component_name": "Service Card 3",
              "component_type": "Card",
              "props": {},
              "componentName": "Service Card 3",
              "componentType": "Card",
              "componentContent": "Customs Clearance",
              "componentStyles": "Card-primary, Icon-top, Text-center",
              "componentInteractivity": "On-hover elevate"
            }
          ],
          "sectionName": "Services Showcase",
          "layoutType": "Grid",
          "componentAlignment": "Center",
          "designNotes": "3-column grid of service cards with icons and descriptions, light green background."
        }
      ],
      "pageName": "Homepage",
      "pagePath": "/",
      "metaTitle": "Shahs Logistics | Your Trusted Global Logistics Partner",
      "metaDescription": "Shahs Logistics offers fast, reliable, and hassle-free global logistics services including freight forwarding, warehousing, and customs clearance.",
      "metaKeywords": "logistics, freight, shipping, warehousing, customs, global, fast, reliable, Shahs Logistics, transportation"
    },
    {
      "page_name": "About Us",
      "page_path": "/about",
      "sections": [
        {
          "section_name": "Hero Section",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Our Story",
              "componentStyles": "h1-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Hero Section",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Large title on a light background, subtle top and bottom padding."
        },
        {
          "section_name": "Company Overview",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "About Shahs Logistics",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Paragraph",
              "component_type": "Text",
              "props": {},
              "componentName": "Paragraph",
              "componentType": "Text",
              "componentContent": "Shahs Logistics was established in 2005 with a vision to streamline global trade and provide unparalleled logistics solutions. Today, we are proud to be a trusted name, connecting businesses and communities.",
              "componentStyles": "p-text-large, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Company Overview",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Large text block, center aligned, ample spacing."
        },
        {
          "section_name": "Team Section",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Meet Our Team",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Team Card 1",
              "component_type": "Card",
              "props": {},
              "componentName": "Team Card 1",
              "componentType": "Card",
              "componentContent": "John Doe - CEO",
              "componentStyles": "Image-top, Text-bottom",
              "componentInteractivity": "On-hover blur effect"
            },
            {
              "component_name": "Team Card 2",
              "component_type": "Card",
              "props": {},
              "componentName": "Team Card 2",
              "componentType": "Card",
              "componentContent": "Jane Smith - COO",
              "componentStyles": "Image-top, Text-bottom",
              "componentInteractivity": "On-hover blur effect"
            }
          ],
          "sectionName": "Team Section",
          "layoutType": "Grid",
          "componentAlignment": "Center",
          "designNotes": "Grid of team member cards with photos and titles."
        }
      ],
      "pageName": "About Us",
      "pagePath": "/about",
      "metaTitle": "About Shahs Logistics | Our Company History & Values",
      "metaDescription": "Learn more about Shahs Logistics' mission, vision, and dedicated team.",
      "metaKeywords": "about us, history, mission, vision, values, team, Shahs Logistics"
    },
    {
      "page_name": "Services",
      "page_path": "/services",
      "sections": [
        {
          "section_name": "Services Hero",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Our Services",
              "componentStyles": "h1-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Sub-heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Sub-heading",
              "componentType": "Text",
              "componentContent": "We offer a wide range of logistics solutions.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Services Hero",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Title and description on a light background."
        },
        {
          "section_name": "Freight Forwarding",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Freight Forwarding",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Paragraph",
              "component_type": "Text",
              "props": {},
              "componentName": "Paragraph",
              "componentType": "Text",
              "componentContent": "Global freight solutions by air, sea, and land.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Image",
              "component_type": "Image",
              "props": {},
              "componentName": "Image",
              "componentType": "Image",
              "componentContent": "/assets/freight.jpg",
              "componentStyles": "Full-width",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Freight Forwarding",
          "layoutType": "Two-column",
          "componentAlignment": "Left",
          "designNotes": "Text on left, image on right, alternating background color."
        },
        {
          "section_name": "Warehousing",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Warehousing",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Paragraph",
              "component_type": "Text",
              "props": {},
              "componentName": "Paragraph",
              "componentType": "Text",
              "componentContent": "Secure storage and distribution services.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Image",
              "component_type": "Image",
              "props": {},
              "componentName": "Image",
              "componentType": "Image",
              "componentContent": "/assets/warehouse.jpg",
              "componentStyles": "Full-width",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Warehousing",
          "layoutType": "Two-column",
          "componentAlignment": "Right",
          "designNotes": "Image on left, text on right, alternating background color."
        }
      ],
      "pageName": "Services",
      "pagePath": "/services",
      "metaTitle": "Shahs Logistics | Full List of Services",
      "metaDescription": "Detailed breakdown of all logistics services provided by Shahs Logistics.",
      "metaKeywords": "all services, freight forwarding, warehousing, customs clearance, Shahs Logistics"
    },
    {
      "page_name": "Contact",
      "page_path": "/contact",
      "sections": [
        {
          "section_name": "Contact Hero",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Contact Us",
              "componentStyles": "h1-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Sub-heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Sub-heading",
              "componentType": "Text",
              "componentContent": "Reach out to our team for any assistance.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Contact Hero",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Large title and subheading, light background."
        },
        {
          "section_name": "Contact Form",
          "components": [
            {
              "component_name": "Form",
              "component_type": "Form",
              "props": {},
              "componentName": "Form",
              "componentType": "Form",
              "componentContent": "Contact Form (Name, Email, Phone, Message)",
              "componentStyles": "Rounded-inputs, Submit-button-primary",
              "componentInteractivity": "Form validation, Success/error message"
            },
            {
              "component_name": "Map",
              "component_type": "Map",
              "props": {},
              "componentName": "Map",
              "componentType": "Map",
              "componentContent": "Google Map (Shahs Logistics HQ)",
              "componentStyles": "Full-width, Aspect-ratio-16-9",
              "componentInteractivity": "Zoom, Pan"
            }
          ],
          "sectionName": "Contact Form",
          "layoutType": "Two-column",
          "componentAlignment": "Center",
          "designNotes": "Contact form on the left, map on the right."
        },
        {
          "section_name": "Contact Info",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Our Office",
              "componentStyles": "h2-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Icon/Text", // Not in available components, will use Placeholder
              "component_type": "Text",
              "props": {},
              "componentName": "Icon/Text",
              "componentType": "Text",
              "componentContent": "Address: 123 Logistics St, City, Country",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Icon/Text", // Not in available components, will use Placeholder
              "component_type": "Text",
              "props": {},
              "componentName": "Icon/Text",
              "componentType": "Text",
              "componentContent": "Phone: +123 456 7890",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Icon/Text", // Not in available components, will use Placeholder
              "component_type": "Text",
              "props": {},
              "componentName": "Icon/Text",
              "componentType": "Text",
              "componentContent": "Email: info@shahslogistics.com",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            }
          ],
          "sectionName": "Contact Info",
          "layoutType": "Grid",
          "componentAlignment": "Center",
          "designNotes": "3-column grid for address, phone, and email."
        }
      ],
      "pageName": "Contact",
      "pagePath": "/contact",
      "metaTitle": "Contact Shahs Logistics | Get in Touch",
      "metaDescription": "Contact Shahs Logistics for inquiries, support, or to request a quote.",
      "metaKeywords": "contact, form, address, phone, email, support, get in touch, Shahs Logistics"
    },
    {
      "page_name": "Pricing",
      "page_path": "/pricing",
      "sections": [
        {
          "section_name": "Pricing Hero",
          "components": [
            {
              "component_name": "Heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Heading",
              "componentType": "Text",
              "componentContent": "Our Pricing",
              "componentStyles": "h1-text, Poppins-font, Dark-blue-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Sub-heading",
              "component_type": "Text",
              "props": {},
              "componentName": "Sub-heading",
              "componentType": "Text",
              "componentContent": "Choose the best plan for your needs.",
              "componentStyles": "p-text, Open-Sans-font, Dark-gray-color",
              "componentInteractivity": "None"
            },
            {
              "component_name": "Toggle",
              "component_type": "Button",
              "props": {},
              "componentName": "Toggle",
              "componentType": "Button",
              "componentContent": "Monthly/Yearly",
              "componentStyles": "Primary-toggle, Two-options",
              "componentInteractivity": "Switch pricing display"
            }
          ],
          "sectionName": "Pricing Hero",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Heading, subheading, and a monthly/yearly toggle."
        },
        {
          "section_name": "Pricing Plans",
          "components": [
            {
              "component_name": "Pricing Card 1",
              "component_type": "Card",
              "props": {},
              "componentName": "Pricing Card 1",
              "componentType": "Card",
              "componentContent": "Basic Plan",
              "componentStyles": "Card-secondary, Features-list, Primary-btn",
              "componentInteractivity": "On-hover scale"
            },
            {
              "component_name": "Pricing Card 2",
              "component_type": "Card",
              "props": {},
              "componentName": "Pricing Card 2",
              "componentType": "Card",
              "componentContent": "Premium Plan",
              "componentStyles": "Card-primary, Features-list, Primary-btn, Highlighted",
              "componentInteractivity": "On-hover scale"
            },
            {
              "component_name": "Pricing Card 3",
              "component_type": "Card",
              "props": {},
              "componentName": "Pricing Card 3",
              "componentType": "Card",
              "componentContent": "Enterprise Plan",
              "componentStyles": "Card-secondary, Features-list, Primary-btn",
              "componentInteractivity": "On-hover scale"
            }
          ],
          "sectionName": "Pricing Plans",
          "layoutType": "Grid",
          "componentAlignment": "Center",
          "designNotes": "3-column grid of pricing cards with features and CTA."
        }
      ],
      "pageName": "Pricing",
      "pagePath": "/pricing",
      "metaTitle": "Shahs Logistics | Pricing Plans",
      "metaDescription": "Explore flexible pricing plans for logistics services tailored to your needs.",
      "metaKeywords": "pricing, plans, rates, tiers, logistics services, cost, Shahs Logistics"
    },
    {
      "page_name": "Login",
      "page_path": "/login",
      "sections": [
        {
          "section_name": "Login Form Section",
          "components": [
            {
              "component_name": "Form",
              "component_type": "Form",
              "props": {},
              "componentName": "Form",
              "componentType": "Form",
              "componentContent": "Login Form (Email, Password)",
              "componentStyles": "Rounded-inputs, Primary-btn",
              "componentInteractivity": "Client-side validation, Form submission"
            },
            {
              "component_name": "Button",
              "component_type": "Button",
              "props": {},
              "componentName": "Button",
              "componentType": "Button",
              "componentContent": "Login",
              "componentStyles": "Primary-btn, Orange-background",
              "componentInteractivity": "On-click form submit"
            },
            {
              "component_name": "Link",
              "component_type": "Link",
              "props": {},
              "componentName": "Link",
              "componentType": "Link",
              "componentContent": "Forgot Password?",
              "componentStyles": "Text-link, Light-gray-color",
              "componentInteractivity": "On-click navigate to /forgot-password"
            },
            {
              "component_name": "Link",
              "component_type": "Link",
              "props": {},
              "componentName": "Link",
              "componentType": "Link",
              "componentContent": "Sign Up",
              "componentStyles": "Text-link, Light-gray-color",
              "componentInteractivity": "On-click navigate to /signup"
            }
          ],
          "sectionName": "Login Form Section",
          "layoutType": "Full-width",
          "componentAlignment": "Center",
          "designNotes": "Centered login form with minimal background, focusing on the form."
        }
      ],
      "pageName": "Login",
      "pagePath": "/login",
      "metaTitle": "Shahs Logistics | Login",
      "metaDescription": "Login to your Shahs Logistics account to track shipments and manage your profile.",
      "metaKeywords": "login, signin, account, track, shipments, Shahs Logistics"
    }
  ],
  "design_system": null,
  "siteName": "Shahs Logistics",
  "industry": "Logistics",
  "branding": {
    "primaryColor": "#233D4D",
    "secondaryColor": "#A7D7C5",
    "accentColor": "#F4B860",
    "textColor": "#EFEFEF",
    "fontFamilyHeading": "Poppins",
    "fontFamilyBody": "Open Sans",
    "logoPlacement": "Top-Left"
  },
  "globalComponents": [
    {
      "componentName": "Header",
      "componentType": "Layout",
      "props": {},
      "componentContent": "Logo, Nav Links (Home, About, Services, Pricing, Contact), Login/SignUp Buttons",
      "componentStyles": "Fixed top-bar, Dark background, Light text",
      "componentInteractivity": "Sticky on scroll"
    },
    {
      "componentName": "Footer",
      "componentType": "Layout",
      "props": {},
      "componentContent": "Logo, Copyright, Quick Links, Social Media Icons",
      "componentStyles": "Dark background, Light text, Padding, Responsive",
      "componentInteractivity": "None"
    }
  ]
};

// Component Imports
// Placeholder for components that are not found or not in the allowed list
const Placeholder = dynamic(() => import('@/components/Placeholder'));

const ComponentMap: Record<string, ReturnType<typeof dynamic>> = {
  'Heading': dynamic(() => import('@/components/Heading')),
  'Sub-heading': dynamic(() => import('@/components/SubHeading')),
  'Button': dynamic(() => import('@/components/Button')),
  'Paragraph': dynamic(() => import('@/components/Paragraph')),
  'Image': dynamic(() => import('@/components/Image')),
  'Service Card 1': dynamic(() => import('@/components/ServiceCard1')),
  'Service Card 2': dynamic(() => import('@/components/ServiceCard2')),
  'Service Card 3': dynamic(() => import('@/components/ServiceCard3')),
  'Team Card 1': dynamic(() => import('@/components/TeamCard1')),
  'Team Card 2': dynamic(() => import('@/components/TeamCard2')),
  'Form': dynamic(() => import('@/components/Form')),
  'Map': dynamic(() => import('@/components/Map')),
  'Toggle': dynamic(() => import('@/components/Toggle')),
  'Pricing Card 1': dynamic(() => import('@/components/PricingCard1')),
  'Pricing Card 2': dynamic(() => import('@/components/PricingCard2')),
  'Pricing Card 3': dynamic(() => import('@/components/PricingCard3')),
  'Link': dynamic(() => import('@/components/Link')),
  'Header': dynamic(() => import('@/components/Header')),
  'Footer': dynamic(() => import('@/components/Footer')),
};

// Character escaping utility for JSX text content ONLY
const escapeJSXText = (text: string | undefined): string | undefined => {
  if (typeof text !== 'string') {
    return text;
  }
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
};

// CRITICAL NEXT.JS 15 REQUIREMENT: EXACT function signature
interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const currentPath: string = slug && slug.length > 0 ? `/${slug.join('/')}` : '/';

  const page: Page | undefined = siteBlueprint.pages.find(
    (p: Page) => p.page_path === currentPath
  );

  if (!page) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
        <p className="text-lg">This page doesn&apos;t exist. Check the URL.</p>
      </main>
    );
  }

  // Find global Header and Footer components
  const globalHeaderComponent: Component | undefined = siteBlueprint.globalComponents.find(
    (gc: Component) => gc.componentName === 'Header'
  );
  const globalFooterComponent: Component | undefined = siteBlueprint.globalComponents.find(
    (gc: Component) => gc.componentName === 'Footer'
  );

  const HeaderComponent = globalHeaderComponent ? ComponentMap[globalHeaderComponent.componentName as string] : undefined;
  const FooterComponent = globalFooterComponent ? ComponentMap[globalFooterComponent.componentName as string] : undefined;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Render Global Header if available */}
      {HeaderComponent && globalHeaderComponent && (
        <HeaderComponent
          {...(globalHeaderComponent.props as Record<string, unknown>)}
          componentStyles={globalHeaderComponent.componentStyles}
          componentInteractivity={globalHeaderComponent.componentInteractivity}
        >
          {escapeJSXText(globalHeaderComponent.componentContent)}
        </HeaderComponent>
      )}

      <main className="container mx-auto p-4">
        {page.sections.map((section: Section, sectionIndex: number) => (
          <section key={sectionIndex} className="mb-8 p-6 bg-white rounded-lg shadow-md">
            {/* Using section_name as the heading because blueprint's heading is null */}
            <h2 className="text-xl font-semibold mb-4">{section.section_name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.components.map((component: Component, componentIndex: number) => {
                const DynamicComponent = ComponentMap[component.component_name];

                if (DynamicComponent) {
                  return (
                    <DynamicComponent
                      key={componentIndex}
                      {...(component.props as Record<string, unknown>)}
                      componentStyles={component.componentStyles}
                      componentInteractivity={component.componentInteractivity}
                    >
                      {escapeJSXText(component.componentContent)}
                    </DynamicComponent>
                  );
                } else {
                  // If component_name is not found in the map, render Placeholder
                  return (
                    <Placeholder
                      key={componentIndex}
                      componentName={component.component_name}
                      componentContent={escapeJSXText(component.componentContent)}
                      {...(component.props as Record<string, unknown>)}
                      componentStyles={component.componentStyles}
                      componentInteractivity={component.componentInteractivity}
                    />
                  );
                }
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Render Global Footer if available */}
      {FooterComponent && globalFooterComponent && (
        <FooterComponent
          {...(globalFooterComponent.props as Record<string, unknown>)}
          componentStyles={globalFooterComponent.componentStyles}
          componentInteractivity={globalFooterComponent.componentInteractivity}
        >
          {escapeJSXText(globalFooterComponent.componentContent)}
        </FooterComponent>
      )}
    </div>
  );
}