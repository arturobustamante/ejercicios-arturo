// import { z } from "zod";
const z = require('zod'); 

const UserZod = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  lastname: z.string({
    required_error: "Lastname is required",
    invalid_type_error: "Lastname must be a string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
  email: z.string().email({
    required_error: "Email is required",
    invalid_type_error: "Email must be a email valid",
  }),
});

module.exports = UserZod;