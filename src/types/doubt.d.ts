type DoubtReply = {
  id: string;
  author: string;
  content: string;
};

type DoubtAnswer = {
  id: string;
  content: string;
  author: string;
  replies: Array<string>;
};

type Doubt = {
  id: string;
  title: string;
  author: string;
  content: string;
  answers: Array<string>;
  tags: Array<string>;
};
