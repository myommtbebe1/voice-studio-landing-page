import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../hooks/useLanguage.js';
function CardVoiceSample() {
  const { t } = useLanguage();
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
      <div className="snap-center shrink-0 w-[280px] bg-white  rounded-4xl p-5 shadow-sm  hover:shadow-md transition-all group cursor-pointer">
        <div className="relative mb-4 rounded-2xl overflow-hidden aspect-4/3">
          <img
            alt="Woman portrait for AI Voice"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_F7TV2Euxf9P0Rjo4dLHyrwODwqSKYpa3gJ0-TVDSixNnwpZmdqdalj_giTT75Dw3AtySwZKgE7YvcUI1bUwULmV8h_qf4xIObwqFJN_pW9He4N4Ol_1qDEphCh5WaMgRqPW7i71Q_q6c1kaGenXn6u9AifpEUq7JqINdzxg_NKQGoBFFIRnkqOgcKHw9jR0t6xmUHz9vwhqp5SkEc1aiMR9GYFl6SXY7iGpKrLDawgROqDY3cYNb3cMKGY2hPb1kyhSm0TRqmA"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="size-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-110 transition-all">
              <FontAwesomeIcon
                icon={faPlay}
                style={{ color: "#1313ec" }}
                size="lg"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-gray-600">Sarah</h4>
            <p className="text-xs text-gray-500 ">
            American • Softt • News
            </p>
          </div>
          <div className="size-8 rounded-full bg-green-50 text-green-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
          </div>
        </div>
      </div>

      <div className="snap-center shrink-0 w-[280px] bg-white  rounded-4xl p-5 shadow-sm  hover:shadow-md transition-all group cursor-pointer">
        <div className="relative mb-4 rounded-2xl overflow-hidden aspect-4/3">
          <img
            alt="Man portrait for AI Voice"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCYAmFvoxv_CoZf9XV2OicNNiL2tsFD_-JWtnd-s5rRmzPbMuI9MMthufTs8wEUcpiOBodS01t9ljL9iSFviuxqVjTtVG51ZWdgtOsilMoxYzjnYpHL7vW0JUuQY3Qq5aWnMDoBHTXMLgNACfz4OlWLh2uirWupdCzWqIp1Nid3Nby1otTPHc6LFglkMVUukTMQ6TKttL2yYebS1200aYwNbfvgSngpoT4lQU9xnItwNshoZI-0F6bJWFXlGvUYJ2gkbL7_9jh2g"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="size-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-110 transition-all">
              <FontAwesomeIcon
                icon={faPlay}
                style={{ color: "#1313ec" }}
                size="lg"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-gray-600">Marcus</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              British • Deep • News
            </p>
          </div>
          <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
          </div>
        </div>
      </div>

      <div className="snap-center shrink-0 w-[280px] bg-white  rounded-4xl p-5 shadow-sm  hover:shadow-md transition-all group cursor-pointer">
        <div className="relative mb-4 rounded-2xl overflow-hidden aspect-4/3">
          <img
            alt="Woman portrait for AI Voice"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg9Mi8qwTybzAH4xN_knxi3Bi9ISt6xQ56eAOCyK7tCDW7ip-_KAPzvukpEHd2dbiM-G7VF_GCFoGSC0PU8mJGj6v0JQNaBzcX0WEWCy5-nxg_-TeH0Qrp7YFBXnTJIR5kXhP842BMNV4YAQpLjySJlDhfxYLlwDS2VdbJ8pMcd2KmB6fM0Sq8XCzviEXLuUgBw2WEJIGr58CGXHzMTRWxPcSQPLSj60wxL9Hqs5E8b08fmhhVYImzbieYVVz4Omv4PguWv_jmAQ"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="size-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-110 transition-all">
              <FontAwesomeIcon
                icon={faPlay}
                style={{ color: "#1313ec" }}
                size="lg"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-gray-600">Elena</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Spanish • Upbeat • Ads
            </p>
          </div>
          <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
          </div>
        </div>
      </div>

      <div className="snap-center shrink-0 w-[280px] bg-white  rounded-4xl p-5 shadow-sm  hover:shadow-md transition-all group cursor-pointer">
        <div className="relative mb-4 rounded-2xl overflow-hidden aspect-4/3">
          <img
            alt="Man portrait for AI Voice"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7oj6SmXnhDU-Oj2U_y8zdDg0YC89qjERJkcQS7Lz5F_7bfbrsDsYDj_BBv_KbA8Km2XaDm6ZP5MnQIh8IZozLt0Ugi_xfLCav8C4Ef7mNPFrok9q4qyDVnffhFmfa-nCNoSSfAuDpFQ9iw-uZxIKWcGEMqttUkRDT7o8iGuiaaZY6by9pOQ-GQCd3Mb_u3uIkOgc7w8A7ED6hQQNam28abF6YQdsLyM3lT-et_DmJuVINw3G_5MSy8jhaIzST55z4BZV9vYFf7Q"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="size-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-110 transition-all">
              <FontAwesomeIcon
                icon={faPlay}
                style={{ color: "#1313ec" }}
                size="lg"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg text-gray-600">Kenji</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Japanese • Professional
            </p>
          </div>
          <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default CardVoiceSample;
