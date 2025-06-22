export const customLogger = (message: string, ...rest: string[]) => {
  const timestamp = new Date().toISOString();
  console.log(timestamp, message, ...rest);
};
