export interface TableHeader {
  label: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
}

export interface Tab {
  id: string;
  label: string;
}
