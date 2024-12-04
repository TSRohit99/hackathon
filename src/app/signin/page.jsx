"use client"
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Link from 'next/link';

import { showToastWithCloseButton } from '@/hooks/showToast';
import signInValidation from '@/hooks/signInValidation';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { toggleButtonLoading } from '@/lib/features/subjects/subjectSlice';


const IoEyeSharp = dynamic(() => import('react-icons/io5').then(mod => mod.IoEyeSharp), { ssr: false });
const IoEyeOffSharp = dynamic(() => import('react-icons/io5').then(mod => mod.IoEyeOffSharp), { ssr: false });

const Page = () => {
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const isButtonLoading = useAppSelector(store => store.subjectStore.isButtonLoading);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (router?.query?.message) {
            showToastWithCloseButton(router.query.message, 'success');
        }
    }, [router.query]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: signInValidation,
        onSubmit: async (values) => {
            try {
                dispatch(toggleButtonLoading(true));
                const response = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signin`, { ...values });
                console.log(response.data);

                dispatch(toggleButtonLoading(false));
                router.push('/');

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
                        Welcome to Interview Prep. System
                    </h2>
                    <h4 className='text-0xl md:text-1xl text-slate-600 font-medium'>
                        Please enter your details.
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

                <div className='w-full'>
                    {getValidationString('password')}
                    <br />
                    <div className='flex justify-between rounded border border-slate-300 outline-none px-2 py-1 text-slate-500 font-medium'>
                        <input
                            type={isPasswordShow ? 'text' : 'password'}
                            name="password"
                            required
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder='password'
                            value={formik.values.password}
                            className='w-full placeholder:font-normal outline-none'
                        />
                        <button onClick={() => setIsPasswordShow(prev => !prev)}>
                            {isPasswordShow ? <IoEyeSharp className="text-slate-500" /> : <IoEyeOffSharp className="text-slate-500" />}
                        </button>
                    </div>
                </div>

                <div className='w-full flex justify-end'>
                    <Link className='text-left text-red-400 font-semibold hover:underline ' href={'/forgot-password'}>Forgot Password</Link>
                </div>

                <button type='submit' className='w-full bg-tomato_1 px-2 py-1 text-white font-semibold rounded'>
                    {isButtonLoading ? <span className='loading loading-spinner loading-xs text-slate-500'></span> : "Sign In"}
                </button>

                <p className='text-slate-500 font-medium'>Do not have an account? <Link href={'/signup'} className='text-tomato_1 hover:underline'>Sign Up</Link></p>

            </form>
        </section>
    );
};

export default Page;