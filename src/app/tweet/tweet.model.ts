import { User } from '../auth/user.model';

export interface Tweet {
  id: string;
  body: string;
  createdAt: Date;
  user: User;
  likes: string[];
  childrenAmount?: number;
  parentId?: string;
}
