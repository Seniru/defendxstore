const isValidPassword = (pass: string): [boolean, reason: string | null] => {
  if (pass.length < 8)
    return [false, "Password must be atleast 8 characters long"]

  if (!/[A-Z]/.test(pass))
    return [false, "Password must include at least one uppercase letter"]

  if (!/[a-z]/.test(pass))
    return [false, "Password must include at least one lowercase letter"]

  if (!/[0-9]/.test(pass))
    return [false, "Password must include at least one number"]

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass))
    return [false, "Password must include at least one symbol"]

  return [true, null]
}

export default isValidPassword
