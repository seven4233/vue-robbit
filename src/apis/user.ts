import httpInstance from '@/utils/http'

interface FormData {
  account: string
  password: string
}

// 登录接口
export function loginAPI<T>(formData: FormData) {
  const { account, password } = formData
  return httpInstance.request<any, T>({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password,
    },
  })
}
