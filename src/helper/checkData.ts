export const checkData = (data: any) => {
  if (!data) {
    throw new Error("No data provided");
  }
};
