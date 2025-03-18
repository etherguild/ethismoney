import { useUIContext } from "@/contexts/UIContext";
import React, { useEffect, useRef, useState } from "react";

interface SectionProps {
    name: string
    children: React.ReactNode;
    head?: string;
    desc?: string | React.ReactNode;
    subhead?: string | React.ReactNode;
    height?: number;
    className?: string;
}

export default function Section({
    name,
    children,
    head,
    desc,
    subhead,
    height,
    className,
}: SectionProps): JSX.Element {
    const { isMobile } = useUIContext();
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={sectionRef}
            id={`${name}-section`}
            style={{
                scrollSnapAlign: "start",
            }}
        >
            <div
                id={`${name}-content`}
                className={`w-full flex flex-col gap-y-[30px] pb-[30px] pt-[30px] desktop:pt-[126px] desktop:pb-[50px] desktop:pl-[0px] desktop:pr-[50px] ${className || ""}`}
                style={{
                    height: !isMobile && height ? height : undefined,
                }}
            >
                {(head || subhead || desc) && (
                    <div className="flex flex-col px-[15px] desktop:px-0">
                        {/* Head */}
                        {head && (
                            <h2
                                className="headline-xl !leading-[41px] desktop:headline-xxl desktop:!leading-[68px]"
                                style={{
                                    paddingBottom: subhead ? "0px" : "15px",

                                }}
                            >
                                {head}
                            </h2>
                        )}
                        {/* Subhead */}
                        {subhead && (
                            <div className="pb-[15px]">{subhead}</div>
                        )}
                        {/* Desc */}
                        {desc && (
                            <div className="text-sm !leading-[20px] desktop:text-md desktop:!leading-[40px]">{desc}</div>
                        )}
                    </div>
                )}
                <div className="flex flex-col desktop:flex-row gap-[30px] w-full">
                    {children}
                </div>
            </div>
        </div >
    )
}