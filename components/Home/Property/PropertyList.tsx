'use client';

import PropertyCard from "./PropertyCard";
import PrimaryButton from "@/components/ui/buttons/Button";
import { Property } from "@/constant";
import { useSearchContext } from "@/providers/SearchProvider";
import ClearSearchButton from "@/components/ui/buttons/ClearSearchButton";
import { getAllProperty } from "@/lib/database/getProperties";
import Loading from "@/components/ui/Loading/Loading";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { removeSearchQuery, setSearchQuery } from "@/utils/searchQuery";

const PropertyList = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isSearchBtnClicked, setCurrentFilter, setIsSearchBtnClicked, setActiveCat, setLocation, setLocationObject, setAdultsCount, setChildrenCount } = useSearchContext();

    const searchParams = useSearchParams();
    const queryString = `?${searchParams.toString()}`;
    const locationQuery = searchParams.get("location");
    const guestQuery = searchParams.get("guest");
    const categoryQuery = searchParams.get("category");
    const priceQuery = searchParams.get("price");
    const alphabetQuery = searchParams.get("alphabate");
    const newestQuery = searchParams.get("newest");
    const limitQuery = searchParams.get("limit");

    const searchKey = locationQuery || guestQuery || categoryQuery || priceQuery || alphabetQuery || newestQuery || limitQuery;

    useEffect(() => {
        const getProperty = async () => {
            try {
                setIsLoading(true);
                const data = await getAllProperty(queryString);
                setProperties(data || []);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        };
        getProperty();
    }, [searchKey, searchParams]);

    const handleShowMore = () => {
        const limit = (properties.length + 20).toString();
        setSearchQuery("limit", limit);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (properties.length < 1 && searchKey) {
        return (
            <div className="flex flex-col lg:pb-60 lg:pt-20 pt-10 pb-20 items-center">
                <h1 className="text-4xl font-bold text-white">Not Matched</h1>
                <ClearSearchButton
                    onClick={() => {
                        setIsSearchBtnClicked(false);
                        setActiveCat('');
                        setLocation('');
                        setCurrentFilter('');
                        setLocationObject(undefined);
                        removeSearchQuery();
                        setChildrenCount(0);
                        setAdultsCount(0);
                    }}
                />
            </div>
        );
    }

    if (properties.length < 1) {
        return (
            <div className="flex flex-col lg:pb-60 lg:pt-20 pt-10 pb-20 items-center">
                <h1 className="text-4xl font-bold text-white">Properties are not found!</h1>
            </div>
        );
    }

    return (
        <>
            {searchKey && properties.length > 0 && (
                <div className="mb-5">
                    <ClearSearchButton
                        onClick={() => {
                            setIsSearchBtnClicked(false);
                            setActiveCat('');
                            setLocation('');
                            setCurrentFilter('');
                            setLocationObject(undefined);
                            removeSearchQuery();
                            setChildrenCount(0);
                            setAdultsCount(0);
                        }}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {properties?.map((property: Property, index: number) => (
                    <PropertyCard key={index} property={property} />
                ))}
            </div>

            <div className="my-10">
                {properties.length >= 20 && (
                    <PrimaryButton onClick={handleShowMore} className="px-5 lg:px-10">
                        Show More
                    </PrimaryButton>
                )}
            </div>
        </>
    );
};

const WrappedPropertyList = () => (
    <Suspense fallback={<Loading />}>
        <PropertyList />
    </Suspense>
);

export default WrappedPropertyList;
