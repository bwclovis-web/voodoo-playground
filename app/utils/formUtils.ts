export const validateEmail = (email: unknown): email is string => typeof email === "string" && email.length > 3 && email.includes("@")

export const createSigninObject = formData => {
  const email = formData.get("email")
  console.log(`%c email`, 'background: #0047ab; color: #fff; padding: 2px:', email)
  const bob = Object.fromEntries(formData.entries())
  console.log(`%c BOB`, 'background: #0047ab; color: #fff; padding: 2px:', bob)
  return bob
}
