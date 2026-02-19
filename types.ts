
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface BlobPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}
