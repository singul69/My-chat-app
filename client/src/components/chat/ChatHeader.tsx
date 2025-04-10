import { Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/ui/user-avatar";

interface ChatHeaderProps {
  partnerName: string;
  partnerGender: string;
}

const ChatHeader = ({ partnerName, partnerGender }: ChatHeaderProps) => {
  return (
    <div className="bg-primary-500 text-white p-4 flex items-center">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow mr-3">
        <UserAvatar name={partnerName} gender={partnerGender} className="h-12 w-12" />
      </div>
      <div>
        <h2 className="font-semibold text-lg">{partnerName}</h2>
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          <span>Online now</span>
        </div>
      </div>
      <div className="ml-auto flex">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-400 transition text-white">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-400 transition text-white">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-400 transition text-white">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
