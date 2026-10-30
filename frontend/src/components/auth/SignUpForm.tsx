/** @format */
import { useState } from 'react';
import { Input, Button } from '../ui/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../../schemas/auth.schema';
import { labelClass, inputClass, buttonClass } from './style';
import { useRegisterMutation } from '../../redux/api/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/slices/authSlice';
// import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string | null>(null);

  // Using React-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    const { confirmPassword, ...rest } = data;
    setApiError(null);
    const result = await registerUser(rest);

    if (result?.data) {
      dispatch(setUser(result.data.user));
    }

    if (result?.error) {
      const err = result.error;
      const message =
        'data' in err && typeof err.data === 'object' && err.data && 'message' in err.data
          ? (err.data as { message: string }).message
          : 'Something went wrong. Please try again.';
      setApiError(message);
    }
  };

  return (
    <div className='w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900'>
      <div className='mb-6'>
        <h1 className='text-xl font-semibold text-slate-900 dark:text-white'>Create your account</h1>
        <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>CompliCare HealthAudit</p>
      </div>

      <form className='space-y-4' noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* fields as before, using labelClass / inputClass */}
        <div>
          <label htmlFor='firstName' className={labelClass}>
            First name
          </label>
          <Input
            id='firstName'
            type='text'
            autoComplete='give-name'
            placeholder='Jane'
            className={inputClass}
            {...register('firstName')}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && <p className='mt-1 text-xs text-red-500'>{errors.firstName.message}</p>}
        </div>

        <div>
          <label htmlFor='lastName' className={labelClass}>
            Last name
          </label>
          <Input
            id='lastName'
            type='text'
            autoComplete='family-name'
            placeholder='Doe'
            className={inputClass}
            {...register('lastName')}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && <p className='mt-1 text-xs text-red-500'>{errors.lastName.message}</p>}
        </div>

        <div>
          <label htmlFor='email' className={labelClass}>
            Work email
          </label>
          <Input
            id='email'
            type='email'
            autoComplete='email'
            placeholder='you@hospital.org'
            className={inputClass}
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor='password' className={labelClass}>
            Password
          </label>
          <Input
            id='password'
            type='password'
            autoComplete='new-password'
            placeholder='••••••••'
            className={inputClass}
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor='confirmPassword' className={labelClass}>
            Confirm password
          </label>
          <Input
            id='confirmPassword'
            type='password'
            autoComplete='new-password'
            placeholder='••••••••'
            className={inputClass}
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword.message}</p>}
        </div>

        {apiError && <p className='text-sm text-red-500'>{apiError}</p>}

        <Button type='submit' isLoading={isLoading} disabled={isLoading} className={buttonClass}>
          Create account
        </Button>
      </form>

      <p className='mt-4 text-sm text-slate-500 dark:text-slate-400'>
        Already have an account?
        {/* <Link to='/login' className='font-medium text-emerald-600 hover:underline dark:text-emerald-400'>
          Sign in
        </Link> */}
        {/* <Button className='font-medium text-emerald-600 hover:underline dark:text-emerald-400'> Sign in</Button> */}
      </p>
    </div>
  );
};

export default SignupForm;
