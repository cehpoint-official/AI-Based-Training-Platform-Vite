import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"; // Import a dark theme

const StyledText = ({
  text,
  aiExplanation,
  handleAIGeneratedExplanation,
  isLoading,
  type,
}) => {
  const aiSectionRef = useRef(null);

  const scrollToAISection = () => {
    if (aiSectionRef.current) {
      aiSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useEffect(() => {
  //   Prism.highlightAll();
  // }, [aiExplanation, text]);

  return (
    <div className="w-full">
      {/* Scroll Trigger */}
      {type === "video & text course" && (
        <div className="text-center my-4 flex items-center justify-center max-lg:flex-col ">
          <p>If you're not satisfied with the video notes,</p>
          <button
            onClick={scrollToAISection}
            className="text-red-500 underline hover:text-red-600 cursor-pointer ml-1"
          >
            try generating text notes!
          </button>
        </div>
      )}

      {/* Transcript Section */}
      {type === "video & text course" && (
        <div className="w-full flex items-center justify-center flex-col">
          <div className="w-full bg-white/40 h-[1px]"></div>
          <h2 className="text-center w-full">VIDEO NOTES</h2>
          <div className="w-full bg-white/40 h-[1px]"></div>
        </div>
      )}

      <div
        className="text-black dark:text-white text-wrap"
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {/* AI Explanation Section */}

      {type === "video & text course" && (
        <section id="generate-ai-section" ref={aiSectionRef} className="mt-10">
          <div className="w-full flex items-center justify-center">
            {aiExplanation ? (
              <div className="w-full flex items-start justify-start flex-col">
                <div className="w-full flex items-center justify-center flex-col">
                  <div className="w-full bg-white/40 h-[1px]"></div>
                  <h2 className="text-center w-full">GENERATED TEXT NOTES</h2>
                  <div className="w-full bg-white/40 h-[1px]"></div>
                </div>
                <div
                  id="aiExplanationContainer"
                  dangerouslySetInnerHTML={{
                    __html: aiExplanation,
                  }}
                />
              </div>
            ) : (
              <button
                className="bg-green-700 w-[16rem] py-3 text-white rounded-lg hover:bg-green-800"
                onClick={handleAIGeneratedExplanation}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Text Notes"}
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default StyledText;
