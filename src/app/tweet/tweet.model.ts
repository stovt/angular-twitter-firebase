import { User } from '../auth/user.model';

export interface Tweet {
  id: string;
  body: string;
  createdAt: firebase.firestore.Timestamp;
  user: User;
  likes: string[];
  childrenAmount?: number;
  parentId?: string;
}
