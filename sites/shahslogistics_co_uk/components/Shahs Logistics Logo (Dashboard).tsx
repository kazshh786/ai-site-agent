import Image from "next/image";
import Link from "next/link";

interface ShahsLogisticsLogoDashboardProps {
  imageSrc: string;
  imageAlt: string;
}

const ShahsLogisticsLogoDashboard: React.FC<ShahsLogisticsLogoDashboardProps> = ({
  imageSrc,
  imageAlt,
}) => {
  return (
    <Link href="/dashboard" className="flex-shrink-0">
      <div className="flex items-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={32} // Adjusted for a dashboard icon size
          height={32} // Adjusted for a dashboard icon size
          className="object-contain"
        />
        <span className="sr-only">Shahs Logistics Dashboard Home</span>
      </div>
    </Link>
  );
};

export default ShahsLogisticsLogoDashboard;