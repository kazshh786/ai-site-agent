import Image from "next/image";

interface TeamCard2Props {
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
}

const TeamCard2: React.FC<TeamCard2Props> = ({
  name,
  role,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div
      className="
        group relative overflow-hidden rounded-xl shadow-lg
        bg-white text-[#233D4D]
        hover:shadow-xl transition-all duration-300 ease-in-out
        max-w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 mx-auto
      "
    >
      <div className="relative w-full h-64 overflow-hidden">
        {/*
          The group-hover:blur-sm and group-hover:scale-105 classes
          apply when the parent 'group' element is hovered, creating a blur and zoom effect on the image.
        */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          layout="fill"
          objectFit="cover"
          className="
            group-hover:blur-sm group-hover:scale-105 transition-all duration-300 ease-in-out
            transform
          "
        />
      </div>

      <div className="p-5 text-center">
        {/*
          The font-poppins and font-open-sans classes assume these
          fonts are configured in tailwind.config.js or imported globally.
        */}
        <h3 className="font-poppins text-xl font-semibold mb-1 text-[#233D4D]">
          {name}
        </h3>
        <p className="font-open-sans text-md font-medium text-gray-600">
          {role}
        </p>
      </div>
    </div>
  );
};

export default TeamCard2;