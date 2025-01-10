declare module "bcryptjs" {
  export function hashSync(data: string, salt: number): string;
  export function hash(data: string, salt: number): Promise<string>;
  export function compareSync(data: string, encrypted: string): boolean;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function genSaltSync(rounds?: number): string;
  export function genSalt(rounds?: number): Promise<string>;
}
