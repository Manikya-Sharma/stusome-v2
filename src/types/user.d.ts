export type Account = {
  name: string;
  email: string;
  image: string;
  image_third_party: boolean;
  posts: Array<string>;
  doubts: Array<string>;
};

export type Message = {
  senderEmail: string;
  receiverEmail: string;
  message: string;
  timeStamp: number;
};
