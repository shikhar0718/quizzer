import RegisterDto from "../src/auth/dto/register.dto.js";

console.log(
  RegisterDto.validate({
    name: "Shikhar",
    email: "test@test.com",
    password: "Shikhar123",
  })
);