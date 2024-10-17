"use client";

import Loading from "@/components/ui/Loading/Loading";
import { getUser } from "@/lib/database/authUser";
import { verifyEmail } from "@/lib/database/verifyEmail";
import { useAuthContext } from "@/providers/AuthProvider";
import { getStoredToken } from "@/utils/tokenStorage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { IoArrowBack } from "react-icons/io5";

const VerifyEmailPage = () => {
    const { setUser } = useAuthContext();
    const [verifyMessage, setVerifyMessage] = useState("");
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const verifyEmailReq = async () => {
            try {
                if (isMounted) {
                    const dbResponse = await verifyEmail({ token });
                    if (dbResponse?.success) {
                        setVerifyMessage(dbResponse?.message);
                        const userToken = getStoredToken();
                        if (!userToken) throw new Error("token is missing");
                        const { user } = await getUser({ token: userToken });
                        setUser(user);
                    } else {
                        setVerifyMessage(dbResponse?.error);
                    }
                }
            } catch (error) {
                console.error("Error verifying email:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        verifyEmailReq();

        return () => {
            isMounted = false;
        };
    }, [token]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto my-10">
            <Link href="/">
                <button
                    type="button"
                    className="text-lg my-2 flex mx-4 items-center justify-center rounded-xl relative py-2 h-[52px] border border-accent text-white duration-200 overflow-hidden z-50 font-semibold px-3 pr-4"
                >
                    <IoArrowBack className="mx-1" />
                    Back to Home
                </button>
            </Link>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-4xl text-white-50 text-center">
                    <p>{verifyMessage}</p>
                </div>
            </div>
        </div>
    );
};

const WrappedVerifyEmailPage = () => (
    <Suspense fallback={<Loading />}>
        <VerifyEmailPage />
    </Suspense>
);

export default WrappedVerifyEmailPage;
