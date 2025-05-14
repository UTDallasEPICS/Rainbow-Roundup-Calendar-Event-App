export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNum: string;
  role: "SUPER" | "ADMIN" | "USER";
  profilePic: string;
};
