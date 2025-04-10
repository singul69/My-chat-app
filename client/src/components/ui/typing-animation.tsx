import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  className?: string;
}

const TypingAnimation = ({ className }: TypingAnimationProps) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "200ms" }}></div>
      <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "400ms" }}></div>
    </div>
  );
};

export default TypingAnimation;
