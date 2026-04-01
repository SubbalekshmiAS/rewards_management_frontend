import { loginApi } from "../authApi";

export const loginService = async (email: string, password: string) => {

  try {

    const response = await loginApi({
      email,
      password
    });

    return {
      success: true,
      data: response
    };

  } catch (error: any) {

    if (error.response) {

      const data = error.response.data;

      return {
        success: false,
        errors: data.errors || { general: [data.message] }
      };

    }

    return {
      success: false,
      errors: { general: ["Server not reachable"] }
    };

  }

};