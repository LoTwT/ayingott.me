interface IBilling {
  date: string
  price: number
  description: string
}

const billings: IBilling[] = [
  {
    date: "2022-05",
    price: 1.1,
    description: "AWS 弹性 IP 未绑定 EC2 实例的空置消耗",
  },
  {
    date: "2022-05",
    price: 25,
    description: "ayingott.me 域名注册一年",
  },
]

export default defineEventHandler(() => billings)
