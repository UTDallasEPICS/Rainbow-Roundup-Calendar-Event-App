import { ref } from 'vue';

type UserInfo = {
  id: string;
  profilePic: string | null;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
};

const user = ref<UserInfo | null>(null);

export function useUser() {
  return { user };
}