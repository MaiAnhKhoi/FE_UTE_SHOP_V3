"use client";

import { useEffect } from "react";

export default function ScrollTop() {
  useEffect(() => {
    const goTop = document.getElementById("goTop") as HTMLButtonElement | null;
    const borderProgress = document.querySelector(
      ".border-progress"
    ) as HTMLElement | null;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progressAngle = (scrollPercent / 100) * 360;

      if (borderProgress) {
        borderProgress.style.setProperty(
          "--progress-angle",
          `${progressAngle}deg`
        );
      }

      if (goTop) {
        if (scrollTop > 100) {
          goTop.classList.add("show");
        } else {
          goTop.classList.remove("show");
        }
      }
    };

    const handleGoTopClick = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    if (goTop) {
      goTop.addEventListener("click", handleGoTopClick);
    }

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (goTop) {
        goTop.removeEventListener("click", handleGoTopClick);
      }
    };
  }, []);

  return (
    <button id="goTop">
      <span className="border-progress"></span>
      <span className="icon icon-arrow-right"></span>
    </button>
  );
}
