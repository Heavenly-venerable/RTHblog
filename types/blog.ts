export interface Label {
  name: string;
}

export interface BlogPost {
  number: number;
  title: string;
  body: string;
  labels?: Label[];
}

export interface Category {
  name: string;
  color?: string;
  description?: string;
}

export interface BlogListProps {
  api: BlogPost[];
  loading?: boolean;
}
