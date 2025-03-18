"use client";
import { ETHisMoneyTitle } from "@/components/EthIsMoney/EthIsMoney";
import LandingContainerChild from "@/components/LandingContainerChild";
import Section from "@/components/LandingPageContainer";
import { Sections } from "@/lib/sections";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useResponsive, useReducedMotion } from "@/lib/gsap-utils";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FirstSection() {
  const MobileMaxWidth = 1117;
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const CheckMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= MobileMaxWidth);
    };

    const handleResize = () => {
      setIsResizing(true);

      setTimeout(() => {
        setIsResizing(false);
        CheckMobile();
      }, 100);
    };

    // Initial check
    CheckMobile();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(() => {
    // increase the size of the section link when it is in view
    gsap.registerPlugin(ScrollTrigger);

    // Section animations
    Sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: `#${section.sectionId}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setActiveSection(section.sectionId);
          setActiveSectionIndex(Sections.findIndex(s => s.sectionId === section.sectionId));

        },
        onEnterBack: () => {
          setActiveSection(section.sectionId);
          setActiveSectionIndex(Sections.findIndex(s => s.sectionId === section.sectionId));
        }
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  // the active section's nav link should move with the section's topoffset
  useGSAP(() => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // find the section's header title .headline-xl
    const activeSection = Sections[activeSectionIndex || 0].sectionId;
    const activeSectionElement = document.getElementById(`${activeSection}-content`);
    const activeSectionHeader = activeSectionElement?.querySelector("h2.headline-xl");

    if (!activeSectionHeader) {
      return;
    }

    const activeSectionHeaderH2 = activeSectionHeader as HTMLHeadingElement;

    const activeSectionHeaderTop = activeSectionHeaderH2.offsetTop;

    // move the active section's nav link to the top of the sidebar
    gsap.to(`#${activeSection}-link`, {
      y: -activeSectionHeaderTop,
      ease: "power2.out",
      duration: 0.3,
      scrollTrigger: {
        trigger: `#${activeSection}-section`,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, [activeSection]);

  const [activeNavAnimationIndex, setActiveNavAnimationIndex] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const NavItems = Sections.slice(0, 3);

    timeoutRef.current = setInterval(() => {
      setActiveNavAnimationIndex((prev) => {
        if (prev === NavItems.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };

  }, []);

  const handleNavItemHover = (index: number) => {
    // pause the animation and set the active nav item
    if (timeoutRef.current) {
      // pause timer so we can start it again after the hover
      clearInterval(timeoutRef.current);
    }
    setActiveNavAnimationIndex(index);
  }

  const handleNavItemLeave = () => {
    // resume the animation
    timeoutRef.current = setInterval(() => {
      setActiveNavAnimationIndex((prev) => {
        if (prev === Sections.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);
  }

  if (isMobile) {
    return (
      <Section name="first" height={795}>
        <div className="w-full flex flex-col items-center pt-[70px] -space-y-[20px]">
          <Image
            src="/eth-is-money-logo.svg"
            alt="ETH is Money logo"
            width={75}
            height={75}
            priority
            className={`object-contain block ${scrollY > 100 && "group-hover:hidden"}`}
          />
          <div className="w-full flex justify-center">
            <ETHisMoneyTitle />
          </div>
        </div>
        <div id="cycle-animated-nav-items" className="px-[15px] h-[175px] w-full relative flex flex-col gap-y-[15px] transition-all duration-300">
          {Sections.slice(0, 3).map((section, index) => {
            const buttonSize = activeNavAnimationIndex == index ? 64 : 32;
            const iconSize = activeNavAnimationIndex == index ? 36 : 18;

            const wasActiveNavItem = activeNavAnimationIndex < index;
            const butonTop = wasActiveNavItem ? index * 64 + 30 : index * 64;
            const left = -buttonSize / 2 + 50;

            let translateY = 0;
            return (
              <div
                key={section.sectionId}
                className="w-fit flex items-center gap-x-[10px] cursor-pointer"
                onTouchStart={() => handleNavItemHover(index)}
                onTouchEnd={handleNavItemLeave}
                onMouseEnter={() => handleNavItemHover(index)}
                onMouseLeave={handleNavItemLeave}
                onClick={() => {
                  const element = document.getElementById(section.sectionId);
                  if (element) {
                    const offset = element.offsetTop;
                    window.scrollTo({ top: offset - 50, behavior: "smooth" });
                  }
                }}
              >
                <div className="relative w-[67px] flex justify-start">
                  <div className="w-[64px] flex items-center justify-center">
                    <div className="group bg-eth-logo flex items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        transform: `translateY(${translateY}px)`,
                        top: `${butonTop}px`,
                        left: `${left}px`,
                        width: `${buttonSize}px`,
                        height: `${buttonSize}px`,
                      }}
                    >
                      <Icon
                        icon={`${section.icon}-monochrome`}
                        className="text-ice size-[18px] transition-all duration-300"
                        style={{
                          width: `${iconSize}px`,
                          height: `${iconSize}px`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={`h-full flex items-center text-blue1 ${activeNavAnimationIndex == index ? "highlight-text-lg" : "text-md"} transition-all duration-300`}>{section.label}</div>
              </div>
            );
          })}
        </div>
        <div className="px-[15px] w-full flex justify-center gap-x-[10px]">
          <div
            className="h-[36px] px-[15px] rounded-full border border-blue2 justify-center items-center flex cursor-pointer select-none"
            onClick={() => {
              const element = document.getElementById("sixth-section");
              if (element) {
                const offset = element.offsetTop;
                window.scrollTo({
                  top: offset - 50,
                  behavior: prefersReducedMotion ? "auto" : "smooth"
                });
              }
            }}
          >
            <div className="flex items-center gap-x-[10px]">
              <div className="text-center text-blue2 text-xs">Join the community</div>
            </div>
            <Icon icon="feather:chevron-right" className="w-[24px] h-[24px] text-blue2" />
          </div>
          <div
            className="h-[36px] px-[15px] rounded-full border border-blue2 justify-center items-center flex cursor-pointer select-none"
            onClick={() => {
              const element = document.getElementById("seventh-section");
              if (element) {
                const offset = element.offsetTop;
                window.scrollTo({
                  top: offset - 50,
                  behavior: prefersReducedMotion ? "auto" : "smooth"
                });
              }
            }}
          >
            <div className="flex items-center gap-x-[10px]">
              <div className="text-center text-blue2 text-xs">Questions and Glossary</div>
            </div>
            <Icon icon="feather:chevron-right" className="w-[24px] h-[24px] text-blue2" />
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section name="first" height={795} className="justify-end">
      <LandingContainerChild className="px-[15px] desktop:px-0 justify-center h-full flex-1">
        <div className="h-[405px] pb-2.5 flex-col justify-end items-start gap-[30px] inline-flex">
          <div className="self-stretch rounded-[999px] justify-start items-center gap-2.5 inline-flex">
            <div className="h-[36px] px-[15px] rounded-full border border-blue2 justify-center items-center flex cursor-pointer select-none"
              onClick={() => {
                const element = document.getElementById("sixth-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <div className="flex items-center gap-x-[10px]">
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.65 1.47129C7.76935 1.47129 7.88381 1.5187 7.9682 1.60309C8.05259 1.68748 8.1 1.80194 8.1 1.92129V8.03488L7.0682 7.00308C6.98381 6.91869 6.86935 6.87128 6.75 6.87128H1.35C1.23065 6.87128 1.11619 6.82387 1.0318 6.73948C0.947411 6.65509 0.900001 6.54063 0.900001 6.42128V1.92129C0.900001 1.80194 0.947411 1.68748 1.0318 1.60309C1.11619 1.5187 1.23065 1.47129 1.35 1.47129H7.65ZM8.60459 0.966694C8.35142 0.71352 8.00804 0.571289 7.65 0.571289H1.35C0.991958 0.571289 0.648581 0.713521 0.395406 0.966694C0.142232 1.21987 0 1.56325 0 1.92129V6.42128C0 6.77932 0.142232 7.1227 0.395406 7.37587C0.64858 7.62905 0.991958 7.77128 1.35 7.77128H6.5636L8.2318 9.43948C8.3605 9.56817 8.55405 9.60667 8.72221 9.53702C8.89036 9.46737 9 9.30328 9 9.12128V1.92129C9 1.56325 8.85777 1.21987 8.60459 0.966694Z" fill="#1B3555" />
                  <path d="M4 8.57129V15.0213C4 15.2437 4.134 15.4443 4.33952 15.5294C4.54505 15.6145 4.78161 15.5675 4.93891 15.4102L6.97782 13.3713H13.35C13.7876 13.3713 14.2073 13.1974 14.5167 12.888C14.8262 12.5786 15 12.1589 15 11.7213V6.22129C15 5.78368 14.8262 5.364 14.5167 5.05456C14.2073 4.74513 13.7876 4.57129 13.35 4.57129H10V5.67129H13.35C13.4959 5.67129 13.6358 5.72923 13.7389 5.83238C13.8421 5.93552 13.9 6.07542 13.9 6.22129V11.7213C13.9 11.8671 13.8421 12.007 13.7389 12.1102C13.6358 12.2133 13.4959 12.2713 13.35 12.2713H6.75C6.60413 12.2713 6.46424 12.3292 6.36109 12.4324L5.1 13.6935V8.57129H4Z" fill="#1B3555" />
                </svg>
                <div className="text-center text-blue2 text-xs">Join the community</div>
              </div>
              <Icon icon="feather:chevron-right" className="w-[24px] h-[24px] text-blue2" />
            </div>
            <div className="h-[36px] px-[15px] rounded-full border border-blue2 justify-center items-center flex cursor-pointer select-none"
              onClick={() => {
                const element = document.getElementById("seventh-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <div className="flex items-center gap-x-[10px]">
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.00274869 4.40046C-0.0529535 3.40708 0.745065 2.57129 1.74925 2.57129H13.2507C14.2549 2.57129 15.053 3.40708 14.9973 4.40046L14.6653 10.3205C14.6256 11.0279 14.0097 11.5666 13.2963 11.5178L7.67812 11.134C7.64588 11.1318 7.61416 11.1429 7.59053 11.1648L4.95427 13.6026C4.45253 14.0665 3.63198 13.7472 3.58308 13.0689L3.45549 11.2991C3.45063 11.2318 3.38879 11.1829 3.32144 11.1932L1.80593 11.4242C1.05713 11.5383 0.372134 10.988 0.33011 10.2386L0.00274869 4.40046ZM1.74925 3.26451C1.14674 3.26451 0.667928 3.76598 0.701349 4.36201L1.02871 10.2001C1.04781 10.5408 1.35917 10.7909 1.69954 10.739L3.21505 10.508C3.68648 10.4362 4.1194 10.7784 4.15339 11.2497L4.28098 13.0196C4.28796 13.1164 4.40519 13.1621 4.47686 13.0958L7.11313 10.658C7.27852 10.505 7.50056 10.427 7.72626 10.4424L13.3444 10.8263C13.6687 10.8484 13.9487 10.6036 13.9667 10.282L14.2987 4.36201C14.3321 3.76598 13.8533 3.26451 13.2507 3.26451H1.74925Z" fill="#1B3555" />
                  <path d="M3.33301 7.97092V5.50564H5.13119V6.00564H3.94484V6.53689H4.92227V6.9987H3.94484V7.97092H3.33301Z" fill="#1B3555" />
                  <path d="M6.97073 5.50564H7.63106L8.54134 7.97092H7.91459L7.7094 7.41884H6.88492L6.68347 7.97092H6.05671L6.97073 5.50564ZM7.60867 7.02648L7.29903 6.07856L6.98192 7.02648H7.60867Z" fill="#1B3555" />
                  <path d="M10.725 7.98828C10.5261 7.98828 10.3458 7.95356 10.1841 7.88411C10.0249 7.81467 9.88689 7.72092 9.76999 7.60286C9.65558 7.48249 9.56729 7.34824 9.50511 7.20009C9.44294 7.04962 9.41185 6.89453 9.41185 6.73481C9.41185 6.57046 9.44418 6.41421 9.50885 6.26606C9.576 6.1156 9.66802 5.98249 9.78491 5.86675C9.9043 5.75101 10.0448 5.65958 10.2065 5.59245C10.3681 5.523 10.5447 5.48828 10.7362 5.48828C10.9327 5.48828 11.1105 5.52416 11.2697 5.59592C11.4314 5.66768 11.5694 5.76374 11.6838 5.88411C11.8007 6.00448 11.8903 6.1399 11.9524 6.29036C12.0146 6.43851 12.0457 6.59013 12.0457 6.74523C12.0457 6.90958 12.0134 7.06583 11.9487 7.21398C11.884 7.36212 11.792 7.49523 11.6726 7.61328C11.5533 7.72902 11.4127 7.82046 11.2511 7.88759C11.0919 7.95472 10.9166 7.98828 10.725 7.98828ZM10.7288 7.48134C10.8457 7.48134 10.9476 7.4605 11.0347 7.41884C11.1217 7.37486 11.1939 7.31814 11.2511 7.2487C11.3083 7.17694 11.3506 7.09708 11.3779 7.00911C11.4078 6.91884 11.4227 6.8274 11.4227 6.73481C11.4227 6.6399 11.4078 6.54847 11.3779 6.4605C11.3481 6.37023 11.3033 6.29036 11.2436 6.22092C11.1839 6.15148 11.1105 6.09708 11.0235 6.05773C10.9364 6.01606 10.8382 5.99523 10.7288 5.99523C10.6119 5.99523 10.5099 6.01722 10.4229 6.0612C10.3383 6.10286 10.2662 6.15958 10.2065 6.23134C10.1493 6.30078 10.1058 6.38064 10.0759 6.47092C10.0485 6.55888 10.0349 6.64916 10.0349 6.74175C10.0349 6.83666 10.0498 6.9281 10.0796 7.01606C10.1095 7.10402 10.153 7.18388 10.2102 7.25564C10.2699 7.32509 10.3433 7.38064 10.4303 7.42231C10.5174 7.46166 10.6169 7.48134 10.7288 7.48134ZM10.5646 6.9987H11.1391L12.083 7.97092H11.5085L10.5646 6.9987Z" fill="#1B3555" />
                </svg>
                <div className="text-center text-blue2 text-xs">Questions and Glossary</div>
              </div>
              <Icon icon="feather:chevron-right" className="w-[24px] h-[24px] text-blue2" />
            </div>
          </div>
        </div>
      </LandingContainerChild>
      <LandingContainerChild
        className="px-[15px] desktop:px-0 justify-end pb-[69px] basis-[469px]"
        height={469}
      >
        <div className="relative grow shrink basis-0 h-[469px] pt-[278px] flex-col justify-end items-center inline-flex pr-[50px]">
          <div
            style={{
              position: "absolute",
              left: -35,

              bottom: -180,
              zIndex: -1,
              // objectFit: "contain",
              // objectPosition: "center",
              overflow: "visible",
              backgroundImage: "url(/eth-token.png)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "calc(50%) center",
              height: "582px",
              width: "582px",
              // luminosity
              mixBlendMode: "luminosity",
            }}
          />
          <div className="self-stretch h-[123px] flex-col justify-start items-center gap-[25px] flex">
            <div className="self-stretch text-center text-blue1 text-lg">ETH (Ether) is the cryptocurrency of the Ethereum economy – a digital gold with yield.</div>
            <div className="px-[15px] py-2.5 bg-blue5 rounded-[999px] justify-center items-center gap-2.5 inline-flex cursor-pointer select-none"
              onClick={() => {
                const element = document.getElementById("fifth-section");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.81651 2.5476C7.16534 1.92248 6.28216 1.57129 5.36127 1.57129H1.19461C0.811076 1.57129 0.500163 1.86977 0.500163 2.23796V12.238C0.500163 12.6061 0.811076 12.9046 1.19461 12.9046H5.77794C6.1463 12.9046 6.49957 13.0451 6.76003 13.2951C7.0205 13.5452 7.13369 13.7177 7.13369 14.0713C7.13369 14.488 7.44461 14.9046 8.00016 14.9046C8.55572 14.9046 8.8335 14.488 8.8335 14.0713V4.90462C8.8335 4.02057 8.46767 3.17272 7.81651 2.5476ZM7.16683 11.9285C6.74815 11.6965 6.40866 11.5713 5.91683 11.5713H1.88905V2.90462H5.0835C5.63603 2.90462 6.16593 3.11534 6.55664 3.49041C6.94734 3.86548 7.16683 4.37419 7.16683 4.90462V11.9285Z" fill="#1B3555" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.18349 2.5476C8.83466 1.92248 9.71784 1.57129 10.6387 1.57129H14.8054C15.1889 1.57129 15.4998 1.86977 15.4998 2.23796V12.238C15.4998 12.6061 15.1889 12.9046 14.8054 12.9046H10.2221C9.8537 12.9046 9.50043 13.0451 9.23997 13.2951C8.9795 13.5452 8.86631 13.7177 8.86631 14.0713C8.86631 14.488 8.55539 14.9046 7.99984 14.9046C7.44428 14.9046 7.1665 14.488 7.1665 14.0713V4.90462C7.1665 4.02057 7.53233 3.17272 8.18349 2.5476ZM8.83317 11.9285C9.25185 11.6965 9.59134 11.5713 10.0832 11.5713H14.1109V2.90462H10.9165C10.364 2.90462 9.83407 3.11534 9.44336 3.49041C9.05266 3.86548 8.83317 4.37419 8.83317 4.90462V11.9285Z" fill="#1B3555" />
              </svg>
              <div className="text-blue1 headline-md">Learn why ETH is Money...</div>
              <Icon icon="feather:chevron-right" className="w-[24px] h-[24px] text-blue1" />
            </div>
          </div>
        </div>
        <div
          className="hidden desktop:flex w-full -left-[76px] justify-center absolute top-[725px] cursor-pointer"
          onClick={() => {
            const element = document.getElementById("second-section");
            if (element) {
              element.scrollIntoView({ behavior: "auto" });
            }
          }}
        >
          <Icon icon={"feather:chevron-down"} className="w-[64px] h-[64px] animate-slow-pulse text-blue5" />
        </div>
      </LandingContainerChild>
    </Section>
  );
}