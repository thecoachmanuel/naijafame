export interface Topic {
  id: string;
  name: string;
  count: number;
}

export interface PostListItem {
  topic: string;
  slug: string;
  title: string;
}

export interface PostContent extends PostListItem {
  content: string;
  textContent: string;
}
