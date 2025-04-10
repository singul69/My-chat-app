import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  gender: string;
  isPremium: boolean;
  createdAt: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const avatarUrl = user.gender === 'male'
    ? `https://randomuser.me/api/portraits/men/${user.id % 70}.jpg`
    : `https://randomuser.me/api/portraits/women/${user.id % 70}.jpg`;
    
  const formattedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <Card className="shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center">
          <img
            src={avatarUrl}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{user.fullName}</h3>
              <Badge variant={user.isPremium ? "default" : "secondary"}>
                {user.isPremium ? "Premium" : "Free"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 mt-3 text-sm">
          <div>
            <span className="text-neutral-500">Username:</span> {user.username}
          </div>
          <div>
            <span className="text-neutral-500">Gender:</span> {user.gender}
          </div>
          <div className="col-span-2 mt-1">
            <span className="text-neutral-500">Joined:</span> {formattedDate}
          </div>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="mt-3 flex justify-end space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
                className="text-neutral-500 hover:text-primary"
              >
                <Edit size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(user.id)}
                className="text-neutral-500 hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
