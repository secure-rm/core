declare module "inquirer" {
  export function prompt(...args: any): Promise<{ [key: string]: string[] }>;
}
