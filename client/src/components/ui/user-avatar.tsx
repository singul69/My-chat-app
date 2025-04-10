import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  gender: string;
  className?: string;
}

// Using consistent avatars for the virtual partners
const VIRTUAL_AVATAR_URLS = {
  male: "https://api.dicebear.com/6.x/micah/svg?seed=Rahul&baseColor=ffc8dd,ffafcc&earrings=0&eyes=variant04,variant09&facialHair=0&hair=shortCombover",
  female: "https://api.dicebear.com/6.x/micah/svg?seed=Ananya&baseColor=ffc8dd,ffafcc&earrings=variant01,variant02&eyes=variant03,variant06&facialHair=0&hair=long"
};

const UserAvatar = ({ name, gender, className = "" }: UserAvatarProps) => {
  // For our virtual partners
  if (name === "Ananya" || name === "Rahul") {
    const avatarUrl = name === "Ananya" ? VIRTUAL_AVATAR_URLS.female : VIRTUAL_AVATAR_URLS.male;
    
    return (
      <Avatar className={className}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
    );
  }
  
  // For regular users, generate avatar based on name and gender
  return (
    <Avatar className={className}>
      <AvatarImage 
        src={`https://api.dicebear.com/6.x/micah/svg?seed=${name}&gender=${gender === "male" ? "male" : "female"}`} 
        alt={name} 
      />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
