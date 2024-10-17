"use client";

import Loading from '@/components/ui/Loading/Loading';
import { useAuthContext } from '@/providers/AuthProvider';
import { getStoredToken } from '@/utils/tokenStorage';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { ImSpinner9 } from 'react-icons/im';

type Inputs = {
    rating: number;
    comment: string;
    selectedRating: number;
};

const FeedbackForm = () => {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const searchParams = useSearchParams();

    const property_id = searchParams.get("property_id");
    console.log(property_id);

    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<Inputs>();

    const [selectedRating, setSelectedRating] = useState({ rating: 0, description: '' });

    const ratingDescriptions = ['Very bad', 'Bad', 'Okay', 'Good', 'Excellent'];

    const handleStarClick = (rating: number) => {
        setSelectedRating({ rating, description: ratingDescriptions[rating - 1] });
        setValue('rating', rating);
    };

    const onSubmit = async (data: any) => {
        console.log(data);

        const token = getStoredToken();
        if (!token) throw new Error('Token is required for get Favorites');

        const feedbackData = {
            propertyId: property_id,
            bookingId: id,
            rating: data?.rating,
            comment: data?.comment,
        };
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/properties/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(feedbackData),
        });

        const responseData = await response.json();
        if (responseData.success) {
            toast.success(responseData?.message);
            setLoading(false);
            reset();
        } else {
            setLoading(false);
            toast.error(responseData?.error);
        }
        setLoading(false);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <div
                    key={i}
                    className="flex items-center gap-2 text-2xl"
                    onClick={() => handleStarClick(i)}
                >
                    {i <= selectedRating.rating && <FaStar className="text-yellow-300 text-2xl" />}
                    {i > selectedRating.rating && <FaRegStar onClick={() => handleStarClick(i)} />}
                </div>
            );
        }
        return stars;
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="lg:mt-20 mt-10 max-w-2xl gap-4 mx-auto bg-primary-50 lg:px-8 lg:py-12 px-3 py-8 text-secondary-50">
                <div className="grid gap-0.5 items-center mb-2">
                    <h1 className="text-3xl font-bold">Write a Review</h1>
                    <p className="text-sm text-gray-500">Share your experience with the community.</p>
                </div>

                <div className="grid gap-2">
                    <label className="font-medium peer-disabled:opacity-70 text-base" htmlFor="review">
                        Your Review
                    </label>
                    <textarea
                        className="resize-none bg-[#2E374A] lg:text-base placeholder:text-secondary-50 placeholder:text-sm flex w-full rounded-md border-none outline-none px-3 py-2 text-sm min-h-[100px]"
                        id="review"
                        rows={4}
                        placeholder="Write your feedback here.(Optional)"
                        {...register('comment')}
                    ></textarea>
                </div>

                <div className="my-6">
                    {selectedRating.rating < 1 && <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
                        Your Rating
                    </label>}

                    <div>
                        {selectedRating.description && <p className="text-base mt-6">{selectedRating.description}</p>}
                    </div>

                    <div className={'flex items-center gap-2 mt-2 mb-4'}>
                        <div className="flex items-center gap-4 text-2xl cursor-pointer" {...register('rating', { required: true })}>
                            {renderStars()}
                        </div>
                    </div>

                    {errors?.rating && <p className="text-red-600 lg:text-base text-sm mb-2">Rating is required!</p>}
                </div>

                <button type="submit" className="w-full bg-blue-500 rounded-md py-3 flex items-center justify-center">
                    {loading ? <ImSpinner9 className="animate-spin text-[26px]" /> : "Save"}
                </button>
            </form>
        </div>
    );
};

// Suspense wrapper component
const Page = () => (
    <Suspense fallback={<Loading />}>
        <FeedbackForm />
    </Suspense>
);

export default Page;
