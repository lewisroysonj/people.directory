const handleSuccessResponse = (
  data: unknown,
  message: string,
): {
  success: boolean;
  message: string;
  data: unknown;
} => {
  return {
    success: true,
    message,
    data,
  };
};

export type HandleSuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export default handleSuccessResponse;
