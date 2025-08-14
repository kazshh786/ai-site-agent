import Image from "next/image";

interface TeamCard1Props {
  /** The name of the team member. */
  name: string;
  /** The title or role of the team member. */
  title: string;
  /** The URL of the team member&apos;s profile image. */
  imageUrl: string;
}

/**
 * A reusable card component to display a team member&apos;s photo, name, and title.
 * It features an &quot;Image-top, Text-bottom&quot; layout and a &quot;On-hover blur effect&quot; on the image.
 *
 * @param {TeamCard1Props} props - The properties for the TeamCard1 component.
 * @returns {JSX.Element} A React component representing a team member&apos;s card.
 */
const TeamCard1: React.FC<TeamCard1Props> = ({ name, title, imageUrl }) => {
  return (
    // The main card container
    // group class is used to enable group-hover utilities on children
    <div className="group relative w-full overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
      {/* Container for the image, positioned at the top */}
      <div className="relative h-56 w-full sm:h-64">
        {/*
          Next.js Image component for optimized images.
          The image applies a scale and blur effect on group hover for an interactive experience.
        */}
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          // Tailwind classes for hover effect: scale and blur
          className="transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:blur-sm"
          // Adding a placeholder and priority for better performance
          // For a real app, an actual blurDataURL from a low-res image or a color could be used
          placeholder="blur" // Could use "empty" or a computed blurDataURL
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // A tiny transparent PNG
          priority={false} // Only set to true for LCP images
        />
      </div>

      {/* Container for the text (name and title), positioned at the bottom */}
      <div className="p-4 text-center">
        {/*
          Team member's name. Uses Poppins font based on the design system's fontFamilyHeading.
          Text color `text-[#233D4D]` is Shahs Logistics' primary color.
        */}
        <h3 className="mb-1 text-xl font-semibold font-['Poppins'] text-[#233D4D]">
          {name}
        </h3>
        {/*
          Team member's title. Uses Open Sans font based on the design system's fontFamilyBody.
          Text color `text-gray-600` provides a professional, complementary shade.
        */}
        <p className="font-['Open_Sans'] text-base text-gray-600">
          {title}
        </p>
      </div>
    </div>
  );
};

export default TeamCard1;