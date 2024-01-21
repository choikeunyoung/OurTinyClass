import { Button } from "@nextui-org/react";
import LoginForm from "../components/LoginForm";
import { login } from "../api/login";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "@/atoms/user";
import Cookies from "js-cookie";
import { useCallback } from "react";

export default function Login() {
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);
  const mutation = useMutation({
    mutationFn: (loginData: { id: string; password: string }) => {
      return login(loginData.id, loginData.password);
    },
    onSuccess: (res) => {
      // 로그인 성공 처리
      if (res.data) {
        // 정상 로그인
        setUserState(res.data);
        Cookies.set("token", res.data.accessToken);
        Swal.fire("성공!", "로그인에 성공하였습니다.", "success").then(() => {
          navigate("/");
        });
      } else {
        Swal.fire(
          "정상적인 로그인에 실패하였습니다. 다시 시도해주세요.",
          "error"
        );
      }
    },
    onError: (error: {
      response: {
        data: {
          message: string;
        };
      };
    }) => {
      // 로그인 실패 처리
      console.error("로그인 실패:", error);
      Swal.fire(
        "error",
        error?.response?.data.message ?? "로그인에 실패하였습니다.",
        "error"
      );
    },
  });

  const onSubmit = (id: string, password: string) => {
    mutation.mutate({ id, password });
  };

  const goJoin = useCallback(() => {
    navigate("/auth/join");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full">
        {/* <img
          alt="School Logo"
          className="mx-auto h-12 w-auto"
          src="/placeholder.svg"
        /> */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          나만의 작은 교실에 오신 것을 환영합니다.
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          계정에 접근하기 위해 로그인을 해주세요.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onSubmit={onSubmit} />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>
            <Button
              className="w-full bg-green-500 hover:bg-green-700 text-white mt-7"
              type="submit"
              onClick={goJoin}
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
