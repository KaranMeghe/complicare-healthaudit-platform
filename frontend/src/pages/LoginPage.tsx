/** @format */

import { Input, Button } from '../components/ui/index';

const SignupForm = () => {
  return (
    <div className='w-full max-w-md'>
      <div
        className='
          rounded-2xl
          border border-slate-200
          bg-white
          p-8
          shadow-lg shadow-slate-200/50
          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-black/20
        '>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div
            className='
              mx-auto mb-4
              flex h-12 w-12 items-center justify-center
              rounded-xl
              bg-emerald-100
              text-emerald-600
              dark:bg-emerald-950
              dark:text-emerald-400
            '>
            <span className='text-xl font-bold'>C</span>
          </div>

          <h1
            className='
              text-2xl font-bold tracking-tight
              text-slate-900
              dark:text-white
            '>
            Create your account
          </h1>

          <p
            className='
              mt-2 text-sm
              text-slate-500
              dark:text-slate-400
            '>
            Start managing healthcare compliance with CompliCare.
          </p>
        </div>

        {/* Form */}
        <form className='space-y-5'>
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            <Input id='firstName' type='text' placeholder='First Name' />

            <Input id='lastName' type='text' placeholder='Last Name' />
          </div>

          <Input id='email' type='email' placeholder='Email' />

          <Input id='password' type='password' placeholder='Password' />

          <Input id='confirmPassword' type='password' placeholder='Confirm Password' />

          <Button type='submit'>Create Account</Button>
        </form>

        {/* Login link */}
        <p
          className='
            mt-6 text-center text-sm
            text-slate-500
            dark:text-slate-400
          '>
          Already have an account?{' '}
          <a
            href='/login'
            className='
              font-medium
              text-emerald-600
              hover:text-emerald-700
              dark:text-emerald-400
              dark:hover:text-emerald-300
            '>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
