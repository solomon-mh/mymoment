/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext(); // Added logout

  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2: Defin submit handler
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // Ensure no active session exists before sign-in

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({ title: "SignIn failed. Please try again" });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      toast({ title: "Sign up failed. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 my-8 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='h3-bold md:h2-bold sm:-pt-1'>Login to Your account</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          Welcome back to<span className='text-lime-400 mx-0.5'>mymoment,</span>{" "}
          Please enter your detail..
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-1 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage className='text-red text-xs italic leading-tight' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage className='text-red text-xs italic leading-tight' />
              </FormItem>
            )}
          />
          <Button type='submit' className='shad-button_primary mt-2'>
            {isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading ...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don&apos;t have an account ?
            <Link
              to='/sign-up'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
