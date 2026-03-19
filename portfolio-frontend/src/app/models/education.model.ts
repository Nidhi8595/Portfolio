export interface Education {
  id:          number;
  degree:      string;
  institution: string;
  grade:       string;
  year:        string;
  board:       string | null;  // null for university (no board)
}
