
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  centered = true, 
  className 
}: SectionTitleProps) => {
  return (
    <div className={cn(
      "mb-10", 
      centered && "text-center",
      className
    )}>
      <h2 className="font-bold text-3xl md:text-4xl mb-3 animate-on-scroll">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-on-scroll">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
