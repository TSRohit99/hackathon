import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useFormik } from 'formik';
import { Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const ForgotPasswordRequest = () => {
    const isButtonLoading = useAppSelector(store => store.subjectStore.isButtonLoading);
    const dispatch = useAppDispatch();

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: signInValidation,
        onSubmit: async (values) => {
            try {
                dispatch(toggleButtonLoading(true));
                const response = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/forgot-password-request`, { ...values });
                console.log(response.data);
                dispatch(toggleButtonLoading(false));
                router.push('/forgot-password');

            } catch (error) {
                dispatch(toggleButtonLoading(false));
                console.log(error);
                showToastWithCloseButton(error.response.data.message || error.message, 'error');
            }
        },
    });

    const getValidationString = (field) => {
        return formik.touched[field] && formik.errors[field] ? (
            <span className='text-red-500 font-semibold'>
                <sup>*</sup>{formik.errors[field]}
            </span>
        ) : (
            <label htmlFor={field} className='text-slate-500 font-medium text-sm'>
                <b className='capitalize'>
                    <sup>*</sup>{field}
                </b>
            </label>
        );
    };

    return (
        <section className='h-screen w-full flex justify-center items-center bg-white'>
            <form onSubmit={formik.handleSubmit} className='flex flex-col items-center gap-3 p-1'>
                <div className='flex flex-col gap-2'>
                    <h2 className={`text-2xl md:text-3xl text-slate-600 font-semibold`}>
                        People can forgot things.
                    </h2>
                    <h4 className='text-0xl md:text-1xl text-slate-600 font-medium'>
                        Please enter your email to reset the password.
                    </h4>
                </div>

                <div className='w-full'>
                    {getValidationString('email')}
                    <br />
                    <input
                        type='email'
                        name="email"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='email'
                        value={formik.values.email}
                        className='w-full rounded border border-slate-300 outline-none px-2 py-1 text-slate-500 font-medium placeholder:font-normal'
                    />
                </div>

                <button type='submit' className='w-full bg-tomato_1 px-2 py-1 text-white font-semibold rounded'>
                    {isButtonLoading ? <span className='loading loading-spinner loading-xs text-slate-500'></span> : "Sign In"}
                </button>

                <p className='text-slate-500 font-medium'>Do not have an account? <Link href={'/signup'} className='text-tomato_1 hover:underline'>Sign Up</Link></p>

            </form>
        </section>
    );
}

export default ForgotPasswordRequest