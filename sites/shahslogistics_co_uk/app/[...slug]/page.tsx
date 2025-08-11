import Link from 'next/link';
import React from 'react';

// TypeScript Type Definitions (provided in prompt)
interface Component {
  component_name: string;
  props: Record<string, unknown>; // Use 'unknown' instead of 'any' for props
  id: string; // Added based on blueprint structure
}

interface Section {
  section_name: string;
  heading: string | null;
  components: Component[];
  id: string; // Added based on blueprint structure
}

interface Page {
  page_name: string;
  page_path: string;
  sections: Section[];
  id: string; // Added based on blueprint structure
}

// Site Blueprint Data (provided in prompt)
const siteBlueprint: { pages: Page[] } = {
  "client_name": "Unknown",
  "pages": [
    {
      "page_name": "Homepage",
      "page_path": "/",
      "sections": [
        {
          "section_name": "Global Header",
          "components": [
            {
              "component_name": "Shahs Logistics Logo",
              "component_type": "Logo",
              "props": {
                "imageSrc": "/assets/logo.png",
                "imageAlt": "Shahs Logistics Logo"
              },
              "id": "C_Logo",
              "type": "Logo",
              "name": "Shahs Logistics Logo"
            },
            {
              "component_name": "Main Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Home",
                    "link": "/"
                  },
                  {
                    "label": "Features",
                    "link": "/features"
                  },
                  {
                    "label": "Pricing",
                    "link": "/pricing"
                  },
                  {
                    "label": "Contact",
                    "link": "/contact"
                  }
                ]
              },
              "id": "C_MainNav",
              "type": "Navigation",
              "name": "Main Navigation"
            },
            {
              "component_name": "Sign Up",
              "component_type": "Button",
              "props": {
                "text": "Sign Up",
                "link": "/signup",
                "variant": "primary",
                "size": "medium"
              },
              "id": "C_SignUpBtn",
              "type": "Button",
              "name": "Sign Up"
            },
            {
              "component_name": "Login",
              "component_type": "Button",
              "props": {
                "text": "Login",
                "link": "/login",
                "variant": "secondary",
                "size": "medium"
              },
              "id": "C_LoginBtn",
              "type": "Button",
              "name": "Login"
            }
          ],
          "id": "S_Header",
          "name": "Global Header",
          "layout": "Fixed top with logo, navigation, and auth buttons"
        },
        {
          "section_name": "Hero Section",
          "components": [
            {
              "component_name": "Main Hero Heading",
              "component_type": "Heading",
              "props": {
                "level": "h1",
                "text": "Streamline Your Logistics Operations"
              },
              "id": "C_HeroHeading",
              "type": "Heading",
              "name": "Main Hero Heading"
            },
            {
              "component_name": "Hero Subtitle",
              "component_type": "Text",
              "props": {
                "text": "Shahs Logistics provides advanced SaaS tools to manage your fleet, deliveries, and supply chain with unparalleled efficiency."
              },
              "id": "C_HeroSubtitle",
              "type": "Text",
              "name": "Hero Subtitle"
            },
            {
              "component_name": "Get Started",
              "component_type": "Button",
              "props": {
                "text": "Get Started",
                "link": "/signup",
                "variant": "primary",
                "size": "large"
              },
              "id": "C_GetStartedBtn",
              "type": "Button",
              "name": "Get Started"
            },
            {
              "component_name": "Book a Demo",
              "component_type": "Button",
              "props": {
                "text": "Book a Demo",
                "link": "/book-demo",
                "variant": "outline",
                "size": "large"
              },
              "id": "C_BookDemoBtn",
              "type": "Button",
              "name": "Book a Demo"
            },
            {
              "component_name": "Background Image",
              "component_type": "Image",
              "props": {
                "imageSrc": "/assets/hero-bg.jpg",
                "imageAlt": "Logistics hub background"
              },
              "id": "C_HeroBgImage",
              "type": "Image",
              "name": "Background Image"
            }
          ],
          "id": "S_Home_Hero",
          "name": "Hero Section",
          "layout": "Full-width background image with centered text and action buttons"
        },
        {
          "section_name": "Testimonials Section",
          "components": [
            {
              "component_name": "Testimonial Heading",
              "component_type": "Heading",
              "props": {
                "level": "h2",
                "text": "What Our Clients Say"
              },
              "id": "C_TestimonialHeading",
              "type": "Heading",
              "name": "Testimonial Heading"
            },
            {
              "component_name": "Customer Review 1",
              "component_type": "QuoteCard",
              "props": {
                "quote": "Shahs Logistics transformed our delivery process!",
                "author": "Alice Doe",
                "role": "Logistics Manager at Coorp"
              },
              "id": "C_Testimonial1",
              "type": "QuoteCard",
              "name": "Customer Review 1"
            },
            {
              "component_name": "Customer Review 2",
              "component_type": "QuoteCard",
              "props": {
                "quote": "Highly reliable and easy to use.",
                "author": "Bob Smith",
                "role": "Owner of Small Moves"
              },
              "id": "C_Testimonial2",
              "type": "QuoteCard",
              "name": "Customer Review 2"
            }
          ],
          "id": "S_Home_Testimonials",
          "name": "Testimonials Section",
          "layout": "Carousel with customer quotes and avatars"
        },
        {
          "section_name": "Global Footer",
          "components": [
            {
              "component_name": "Copyright Info",
              "component_type": "Text",
              "props": {
                "text": "© 2024 Shahs Logistics. All rights reserved."
              },
              "id": "C_Copyright",
              "type": "Text",
              "name": "Copyright Info"
            },
            {
              "component_name": "Footer Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Privacy Policy",
                    "link": "/privacy"
                  },
                  {
                    "label": "Terms of Service",
                    "link": "/terms"
                  }
                ]
              },
              "id": "C_FooterNav",
              "type": "Navigation",
              "name": "Footer Navigation"
            },
            {
              "component_name": "Social Links",
              "component_type": "SocialMediaLinks",
              "props": {
                "links": [
                  {
                    "platform": "Twitter",
                    "url": "https://twitter.com/shahlog"
                  },
                  {
                    "platform": "LinkedIn",
                    "url": "https://linkedin.com/company/shahlog"
                  }
                ]
              },
              "id": "C_SocialLinks",
              "type": "SocialMediaLinks",
              "name": "Social Links"
            }
          ],
          "id": "S_Footer",
          "name": "Global Footer",
          "layout": "Bottom aligned with copyright and footer navigation"
        }
      ],
      "id": "P_Home",
      "name": "Homepage",
      "path": "/"
    },
    {
      "page_name": "Features Page",
      "page_path": "/features",
      "sections": [
        {
          "section_name": "Global Header",
          "components": [
            {
              "component_name": "Shahs Logistics Logo",
              "component_type": "Logo",
              "props": {
                "imageSrc": "/assets/logo.png",
                "imageAlt": "Shahs Logistics Logo"
              },
              "id": "C_Logo",
              "type": "Logo",
              "name": "Shahs Logistics Logo"
            },
            {
              "component_name": "Main Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Home",
                    "link": "/"
                  },
                  {
                    "label": "Features",
                    "link": "/features"
                  },
                  {
                    "label": "Pricing",
                    "link": "/pricing"
                  },
                  {
                    "label": "Contact",
                    "link": "/contact"
                  }
                ]
              },
              "id": "C_MainNav",
              "type": "Navigation",
              "name": "Main Navigation"
            },
            {
              "component_name": "Sign Up",
              "component_type": "Button",
              "props": {
                "text": "Sign Up",
                "link": "/signup",
                "variant": "primary",
                "size": "medium"
              },
              "id": "C_SignUpBtn",
              "type": "Button",
              "name": "Sign Up"
            },
            {
              "component_name": "Login",
              "component_type": "Button",
              "props": {
                "text": "Login",
                "link": "/login",
                "variant": "secondary",
                "size": "medium"
              },
              "id": "C_LoginBtn",
              "type": "Button",
              "name": "Login"
            }
          ],
          "id": "S_Header",
          "name": "Global Header",
          "layout": "Fixed top with logo, navigation, and auth buttons"
        },
        {
          "section_name": "Features Hero Section",
          "components": [
            {
              "component_name": "Features Main Heading",
              "component_type": "Heading",
              "props": {
                "level": "h1",
                "text": "Powerful Features for Modern Logistics"
              },
              "id": "C_FeaturesHeading",
              "type": "Heading",
              "name": "Features Main Heading"
            },
            {
              "component_name": "Features Subtitle",
              "component_type": "Text",
              "props": {
                "text": "Shahs Logistics offers advanced tools to streamline operations, enhance visibility, and optimize efficiency across your supply chain."
              },
              "id": "C_FeaturesSubtitle",
              "type": "Text",
              "name": "Features Subtitle"
            },
            {
              "component_name": "Illustration of Features",
              "component_type": "Image",
              "props": {
                "imageSrc": "/assets/features-illustration.svg",
                "imageAlt": "Illustration of features"
              },
              "id": "C_FeaturesImage",
              "type": "Image",
              "name": "Illustration of Features"
            }
          ],
          "id": "S_Features_Hero",
          "name": "Features Hero Section",
          "layout": "Two column layout with text on left, image on right"
        },
        {
          "section_name": "Feature List Section",
          "components": [
            {
              "component_name": "Real-time Tracking",
              "component_type": "FeatureCard",
              "props": {
                "heading": "Real-time Tracking",
                "description": "Monitor your fleet and shipments on a live map.",
                "icon": "globe"
              },
              "id": "C_FeatureCard_Tracking",
              "type": "FeatureCard",
              "name": "Real-time Tracking"
            },
            {
              "component_name": "Route Optimization",
              "component_type": "FeatureCard",
              "props": {
                "heading": "Route Optimization",
                "description": "Smart algorithms for fuel-efficient routes.",
                "icon": "route"
              },
              "id": "C_FeatureCard_Optimization",
              "type": "FeatureCard",
              "name": "Route Optimization"
            },
            {
              "component_name": "Inventory Management",
              "component_type": "FeatureCard",
              "props": {
                "heading": "Inventory Management",
                "description": "Track and manage inventory across locations.",
                "icon": "box"
              },
              "id": "C_FeatureCard_Inventory",
              "type": "FeatureCard",
              "name": "Inventory Management"
            },
            {
              "component_name": "Advanced Reporting",
              "component_type": "FeatureCard",
              "props": {
                "heading": "Advanced Reporting",
                "description": "Insightful analytics to optimize performance.",
                "icon": "chart-bar"
              },
              "id": "C_FeatureCard_Reporting",
              "type": "FeatureCard",
              "name": "Advanced Reporting"
            }
          ],
          "id": "S_Features_List",
          "name": "Feature List Section",
          "layout": "Responsive grid of feature cards"
        },
        {
          "section_name": "Global Footer",
          "components": [
            {
              "component_name": "Copyright Info",
              "component_type": "Text",
              "props": {
                "text": "© 2024 Shahs Logistics. All rights reserved."
              },
              "id": "C_Copyright",
              "type": "Text",
              "name": "Copyright Info"
            },
            {
              "component_name": "Footer Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Privacy Policy",
                    "link": "/privacy"
                  },
                  {
                    "label": "Terms of Service",
                    "link": "/terms"
                  }
                ]
              },
              "id": "C_FooterNav",
              "type": "Navigation",
              "name": "Footer Navigation"
            },
            {
              "component_name": "Social Links",
              "component_type": "SocialMediaLinks",
              "props": {
                "links": [
                  {
                    "platform": "Twitter",
                    "url": "https://twitter.com/shahlog"
                  },
                  {
                    "platform": "LinkedIn",
                    "url": "https://linkedin.com/company/shahlog"
                  }
                ]
              },
              "id": "C_SocialLinks",
              "type": "SocialMediaLinks",
              "name": "Social Links"
            }
          ],
          "id": "S_Footer",
          "name": "Global Footer",
          "layout": "Bottom aligned with copyright and footer navigation"
        }
      ],
      "id": "P_Features",
      "name": "Features Page",
      "path": "/features"
    },
    {
      "page_name": "Pricing Page",
      "page_path": "/pricing",
      "sections": [
        {
          "section_name": "Global Header",
          "components": [
            {
              "component_name": "Shahs Logistics Logo",
              "component_type": "Logo",
              "props": {
                "imageSrc": "/assets/logo.png",
                "imageAlt": "Shahs Logistics Logo"
              },
              "id": "C_Logo",
              "type": "Logo",
              "name": "Shahs Logistics Logo"
            },
            {
              "component_name": "Main Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Home",
                    "link": "/"
                  },
                  {
                    "label": "Features",
                    "link": "/features"
                  },
                  {
                    "label": "Pricing",
                    "link": "/pricing"
                  },
                  {
                    "label": "Contact",
                    "link": "/contact"
                  }
                ]
              },
              "id": "C_MainNav",
              "type": "Navigation",
              "name": "Main Navigation"
            },
            {
              "component_name": "Sign Up",
              "component_type": "Button",
              "props": {
                "text": "Sign Up",
                "link": "/signup",
                "variant": "primary",
                "size": "medium"
              },
              "id": "C_SignUpBtn",
              "type": "Button",
              "name": "Sign Up"
            },
            {
              "component_name": "Login",
              "component_type": "Button",
              "props": {
                "text": "Login",
                "link": "/login",
                "variant": "secondary",
                "size": "medium"
              },
              "id": "C_LoginBtn",
              "type": "Button",
              "name": "Login"
            }
          ],
          "id": "S_Header",
          "name": "Global Header",
          "layout": "Fixed top with logo, navigation, and auth buttons"
        },
        {
          "section_name": "Pricing Hero Section",
          "components": [
            {
              "component_name": "Pricing Main Heading",
              "component_type": "Heading",
              "props": {
                "level": "h1",
                "text": "Affordable Pricing Plans"
              },
              "id": "C_PricingHeading",
              "type": "Heading",
              "name": "Pricing Main Heading"
            },
            {
              "component_name": "Pricing Subtitle",
              "component_type": "Text",
              "props": {
                "text": "Choose the plan that suits your business size and needs."
              },
              "id": "C_PricingSubtitle",
              "type": "Text",
              "name": "Pricing Subtitle"
            }
          ],
          "id": "S_Pricing_Hero",
          "name": "Pricing Hero Section",
          "layout": "Simple text centered"
        },
        {
          "section_name": "Pricing Plans Section",
          "components": [
            {
              "component_name": "Billing Cycle Toggle",
              "component_type": "ToggleSwitch",
              "props": {
                "label": "Monthly/Yearly",
                "options": [
                  "Monthly",
                  "Yearly"
                ]
              },
              "id": "C_PricingToggle",
              "type": "ToggleSwitch",
              "name": "Billing Cycle Toggle"
            },
            {
              "component_name": "Basic Plan",
              "component_type": "PricingCard",
              "props": {
                "planName": "Basic",
                "price": "$99",
                "features": [
                  "1 User",
                  "Up to 10 Shipments"
                ],
                "buttonText": "Start Basic"
              },
              "id": "C_PricingCard_Basic",
              "type": "PricingCard",
              "name": "Basic Plan"
            },
            {
              "component_name": "Pro Plan",
              "component_type": "PricingCard",
              "props": {
                "planName": "Pro",
                "price": "$199",
                "features": [
                  "5 Users",
                  "Unlimited Shipments"
                ],
                "buttonText": "Go Pro"
              },
              "id": "C_PricingCard_Pro",
              "type": "PricingCard",
              "name": "Pro Plan"
            },
            {
              "component_name": "Enterprise Plan",
              "component_type": "PricingCard",
              "props": {
                "planName": "Enterprise",
                "price": "Contact Us",
                "features": [
                  "Unlimited Users",
                  "Priority Support"
                ],
                "buttonText": "Contact Sales"
              },
              "id": "C_PricingCard_Enterprise",
              "type": "PricingCard",
              "name": "Enterprise Plan"
            }
          ],
          "id": "S_Pricing_Plans",
          "name": "Pricing Plans Section",
          "layout": "Three column pricing card layout with toggle"
        },
        {
          "section_name": "Global Footer",
          "components": [
            {
              "component_name": "Copyright Info",
              "component_type": "Text",
              "props": {
                "text": "© 2024 Shahs Logistics. All rights reserved."
              },
              "id": "C_Copyright",
              "type": "Text",
              "name": "Copyright Info"
            },
            {
              "component_name": "Footer Navigation",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Privacy Policy",
                    "link": "/privacy"
                  },
                  {
                    "label": "Terms of Service",
                    "link": "/terms"
                  }
                ]
              },
              "id": "C_FooterNav",
              "type": "Navigation",
              "name": "Footer Navigation"
            },
            {
              "component_name": "Social Links",
              "component_type": "SocialMediaLinks",
              "props": {
                "links": [
                  {
                    "platform": "Twitter",
                    "url": "https://twitter.com/shahlog"
                  },
                  {
                    "platform": "LinkedIn",
                    "url": "https://linkedin.com/company/shahlog"
                  }
                ]
              },
              "id": "C_SocialLinks",
              "type": "SocialMediaLinks",
              "name": "Social Links"
            }
          ],
          "id": "S_Footer",
          "name": "Global Footer",
          "layout": "Bottom aligned with copyright and footer navigation"
        }
      ],
      "id": "P_Pricing",
      "name": "Pricing Page",
      "path": "/pricing"
    },
    {
      "page_name": "Login Page",
      "page_path": "/login",
      "sections": [
        {
          "section_name": "Login Header",
          "components": [
            {
              "component_name": "Shahs Logistics Logo",
              "component_type": "Logo",
              "props": {
                "imageSrc": "/assets/logo.png",
                "imageAlt": "Shahs Logistics Logo"
              },
              "id": "C_LoginLogo",
              "type": "Logo",
              "name": "Shahs Logistics Logo"
            }
          ],
          "id": "S_Header_Login",
          "name": "Login Header",
          "layout": "Simplified header with logo"
        },
        {
          "section_name": "Login Form Section",
          "components": [
            {
              "component_name": "Login Form Heading",
              "component_type": "Heading",
              "props": {
                "level": "h2",
                "text": "Welcome Back!"
              },
              "id": "C_LoginFormHeading",
              "type": "Heading",
              "name": "Login Form Heading"
            },
            {
              "component_name": "Email Input Field",
              "component_type": "Input",
              "props": {
                "label": "Email Address",
                "placeholder": "Enter your email",
                "type": "email"
              },
              "id": "C_EmailInput",
              "type": "Input",
              "name": "Email Input Field"
            },
            {
              "component_name": "Password Input Field",
              "component_type": "Input",
              "props": {
                "label": "Password",
                "placeholder": "••••••••",
                "type": "password"
              },
              "id": "C_PasswordInput",
              "type": "Input",
              "name": "Password Input Field"
            },
            {
              "component_name": "Submit Login",
              "component_type": "Button",
              "props": {
                "text": "Login",
                "variant": "primary",
                "size": "large",
                "fullWidth": true
              },
              "id": "C_LoginSubmitBtn",
              "type": "Button",
              "name": "Submit Login"
            },
            {
              "component_name": "Forgot Password",
              "component_type": "Link",
              "props": {
                "text": "Forgot Password?",
                "link": "/forgot-password"
              },
              "id": "C_ForgotPasswordLink",
              "type": "Link",
              "name": "Forgot Password"
            }
          ],
          "id": "S_Login_Form",
          "name": "Login Form Section",
          "layout": "Centered card with input fields and button"
        }
      ],
      "id": "P_Login",
      "name": "Login Page",
      "path": "/login"
    },
    {
      "page_name": "Dashboard Page",
      "page_path": "/dashboard",
      "sections": [
        {
          "section_name": "Dashboard Header",
          "components": [
            {
              "component_name": "Shahs Logistics Logo (Dashboard)",
              "component_type": "Logo",
              "props": {
                "imageSrc": "/assets/logo-icon.png",
                "imageAlt": "Shahs Logistics Icon"
              },
              "id": "C_DashboardLogo",
              "type": "Logo",
              "name": "Shahs Logistics Logo (Dashboard)"
            },
            {
              "component_name": "User Profile",
              "component_type": "Dropdown",
              "props": {
                "label": "User Profile",
                "items": [
                  {
                    "label": "Settings",
                    "link": "/dashboard/settings"
                  },
                  {
                    "label": "Logout",
                    "link": "/logout"
                  }
                ]
              },
              "id": "C_UserProfileDropdown",
              "type": "Dropdown",
              "name": "User Profile"
            },
            {
              "component_name": "Notifications",
              "component_type": "Icon",
              "props": {
                "iconName": "bell",
                "count": 3
              },
              "id": "C_NotificationsIcon",
              "type": "Icon",
              "name": "Notifications"
            }
          ],
          "id": "S_DashboardHeader",
          "name": "Dashboard Header",
          "layout": "Top bar with logo, user profile, and notifications"
        },
        {
          "section_name": "Dashboard Sidebar",
          "components": [
            {
              "component_name": "Dashboard Sidebar Nav",
              "component_type": "Navigation",
              "props": {
                "items": [
                  {
                    "label": "Overview",
                    "link": "/dashboard",
                    "icon": "home"
                  },
                  {
                    "label": "Shipments",
                    "link": "/dashboard/shipments",
                    "icon": "truck"
                  },
                  {
                    "label": "Drivers",
                    "link": "/dashboard/drivers",
                    "icon": "user"
                  },
                  {
                    "label": "Analytics",
                    "link": "/dashboard/analytics",
                    "icon": "chart"
                  }
                ]
              },
              "id": "C_SidebarNav",
              "type": "Navigation",
              "name": "Dashboard Sidebar Nav"
            }
          ],
          "id": "S_DashboardSidebar",
          "name": "Dashboard Sidebar",
          "layout": "Left fixed navigation panel"
        },
        {
          "section_name": "Dashboard Main Content Area",
          "components": [
            {
              "component_name": "Dashboard Main Title",
              "component_type": "Heading",
              "props": {
                "level": "h1",
                "text": "Dashboard Overview"
              },
              "id": "C_DashboardTitle",
              "type": "Heading",
              "name": "Dashboard Main Title"
            },
            {
              "component_name": "Total Shipments Card",
              "component_type": "Card",
              "props": {
                "heading": "Total Shipments",
                "value": "1,234",
                "description": "This month"
              },
              "id": "C_TotalShipmentsCard",
              "type": "Card",
              "name": "Total Shipments Card"
            },
            {
              "component_name": "Live Tracking Map",
              "component_type": "Map",
              "props": {
                "mapType": "realtime-tracker",
                "centerLat": "34.0522",
                "centerLng": "-118.2437"
              },
              "id": "C_MapComponent",
              "type": "Map",
              "name": "Live Tracking Map"
            },
            {
              "component_name": "Recent Shipments",
              "component_type": "Table",
              "props": {
                "headers": [
                  "ID",
                  "Status",
                  "Destination"
                ],
                "rows": [
                  [
                    "SH001",
                    "In Transit",
                    "NYC"
                  ],
                  [
                    "SH002",
                    "Delivered",
                    "LA"
                  ]
                ]
              },
              "id": "C_RecentShipmentsTable",
              "type": "Table",
              "name": "Recent Shipments"
            }
          ],
          "id": "S_DashboardContent",
          "name": "Dashboard Main Content Area",
          "layout": "Main content area with cards and tables"
        }
      ],
      "id": "P_Dashboard",
      "name": "Dashboard Page",
      "path": "/dashboard"
    }
  ],
  "design_system": null,
  "companyName": "Shahs Logistics",
  "industry": "Logistics",
  "type": "SaaS Website Blueprint",
  "description": "A modern SaaS website blueprint for Shahs Logistics, focusing on a clean design system, user-friendly interface, and efficient operations management."
};

// Component Imports based on the "Available Components" list.
// If a component is listed here, it should be imported.
// If a component from the blueprint is NOT in this list, Placeholder must be used.
// (Note: All component_names in the provided blueprint map directly to a file name in the available list.)
import Placeholder from '@/components/Placeholder';
import FooterNavigation from '@/components/Footer Navigation';
import RouteOptimization from '@/components/Route Optimization';
import Login from '@/components/Login';
import LoginFormHeading from '@/components/Login Form Heading';
import CustomerReview2 from '@/components/Customer Review 2';
import ForgotPassword from '@/components/Forgot Password';
import PricingMainHeading from '@/components/Pricing Main Heading';
import MainHeroHeading from '@/components/Main Hero Heading';
import TestimonialHeading from '@/components/Testimonial Heading';
import ShahsLogisticsLogoDashboard from '@/components/Shahs Logistics Logo (Dashboard)';
import BillingCycleToggle from '@/components/Billing Cycle Toggle';
import CustomerReview1 from '@/components/Customer Review 1';
import EmailInputField from '@/components/Email Input Field';
import FeaturesMainHeading from '@/components/Features Main Heading';
import HeroSubtitle from '@/components/Hero Subtitle';
import SocialLinks from '@/components/Social Links';
import RealtimeTracking from '@/components/Real-time Tracking';
import LiveTrackingMap from '@/components/Live Tracking Map';
import UserProfile from '@/components/User Profile';
import Notifications from '@/components/Notifications';
import PricingSubtitle from '@/components/Pricing Subtitle';
import FeaturesSubtitle from '@/components/Features Subtitle';
import InventoryManagement from '@/components/Inventory Management';
import ShahsLogisticsLogo from '@/components/Shahs Logistics Logo';
import TotalShipmentsCard from '@/components/Total Shipments Card';
import AdvancedReporting from '@/components/Advanced Reporting';
import PasswordInputField from '@/components/Password Input Field';
import RecentShipments from '@/components/Recent Shipments';
import BackgroundImage from '@/components/Background Image';
import SignUp from '@/components/Sign Up';
import IllustrationOfFeatures from '@/components/Illustration of Features';
import MainNavigation from '@/components/Main Navigation';
import DashboardSidebarNav from '@/components/Dashboard Sidebar Nav';
import BasicPlan from '@/components/Basic Plan';
import ProPlan from '@/components/Pro Plan';
import BookADemo from '@/components/Book a Demo';
import CopyrightInfo from '@/components/Copyright Info';
import GetStarted from '@/components/Get Started';
import SubmitLogin from '@/components/Submit Login';
import DashboardMainTitle from '@/components/Dashboard Main Title';
import EnterprisePlan from '@/components/Enterprise Plan';


interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Construct page_path from slug, defaulting to '/' for empty/undefined slug
  const pagePath: string = slug && slug.length > 0 ? '/' + slug.join('/') : '/';

  // Find the corresponding page in the blueprint
  const page: Page | undefined = siteBlueprint.pages.find(
    (p: Page) => p.page_path === pagePath
  );

  // If no page is found, render a 404 message
  if (!page) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>404 &mdash; Page Not Found</h1>
        <p>The requested URL <code>/{slug ? slug.join('/') : ''}</code> was not found on this server.</p>
        <p>Please check the address or return to the <Link href="/">homepage</Link>.</p>
      </div>
    );
  }

  // Helper function to render components based on their name
  const renderComponent = (component: Component) => {
    switch (component.component_name) {
      case "Footer Navigation":
        return <FooterNavigation {...component.props} />;
      case "Route Optimization":
        return <RouteOptimization {...component.props} />;
      case "Login":
        return <Login {...component.props} />;
      case "Login Form Heading":
        return <LoginFormHeading {...component.props} />;
      case "Customer Review 2":
        return <CustomerReview2 {...component.props} />;
      case "Forgot Password":
        return <ForgotPassword {...component.props} />;
      case "Pricing Main Heading":
        return <PricingMainHeading {...component.props} />;
      case "Main Hero Heading":
        return <MainHeroHeading {...component.props} />;
      case "Testimonial Heading":
        return <TestimonialHeading {...component.props} />;
      case "Shahs Logistics Logo (Dashboard)":
        return <ShahsLogisticsLogoDashboard {...component.props} />;
      case "Billing Cycle Toggle":
        return <BillingCycleToggle {...component.props} />;
      case "Customer Review 1":
        return <CustomerReview1 {...component.props} />;
      case "Email Input Field":
        return <EmailInputField {...component.props} />;
      case "Features Main Heading":
        return <FeaturesMainHeading {...component.props} />;
      case "Hero Subtitle":
        return <HeroSubtitle {...component.props} />;
      case "Social Links":
        return <SocialLinks {...component.props} />;
      case "Real-time Tracking":
        return <RealtimeTracking {...component.props} />;
      case "Live Tracking Map":
        return <LiveTrackingMap {...component.props} />;
      case "User Profile":
        return <UserProfile {...component.props} />;
      case "Notifications":
        return <Notifications {...component.props} />;
      case "Pricing Subtitle":
        return <PricingSubtitle {...component.props} />;
      case "Features Subtitle":
        return <FeaturesSubtitle {...component.props} />;
      case "Inventory Management":
        return <InventoryManagement {...component.props} />;
      case "Shahs Logistics Logo":
        return <ShahsLogisticsLogo {...component.props} />;
      case "Total Shipments Card":
        return <TotalShipmentsCard {...component.props} />;
      case "Advanced Reporting":
        return <AdvancedReporting {...component.props} />;
      case "Password Input Field":
        return <PasswordInputField {...component.props} />;
      case "Recent Shipments":
        return <RecentShipments {...component.props} />;
      case "Background Image":
        return <BackgroundImage {...component.props} />;
      case "Sign Up":
        return <SignUp {...component.props} />;
      case "Illustration of Features":
        return <IllustrationOfFeatures {...component.props} />;
      case "Main Navigation":
        return <MainNavigation {...component.props} />;
      case "Dashboard Sidebar Nav":
        return <DashboardSidebarNav {...component.props} />;
      case "Basic Plan":
        return <BasicPlan {...component.props} />;
      case "Pro Plan":
        return <ProPlan {...component.props} />;
      case "Book a Demo":
        return <BookADemo {...component.props} />;
      case "Copyright Info":
        return <CopyrightInfo {...component.props} />;
      case "Get Started":
        return <GetStarted {...component.props} />;
      case "Submit Login":
        return <SubmitLogin {...component.props} />;
      case "Dashboard Main Title":
        return <DashboardMainTitle {...component.props} />;
      case "Enterprise Plan":
        return <EnterprisePlan {...component.props} />;
      default:
        // Use Placeholder for any unknown component names from the blueprint
        return <Placeholder componentName={component.component_name} {...component.props} />;
    }
  };

  return (
    <div>
      {page.sections.map((section: Section) => (
        <section key={section.id} id={section.id}>
          {section.heading && <h2>{section.heading}</h2>}
          <div>
            {section.components.map((component: Component) => (
              <React.Fragment key={component.id}>
                {renderComponent(component)}
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}