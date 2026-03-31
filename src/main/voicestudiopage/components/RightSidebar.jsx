import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

export default function RightSidebar({ outputs, formatTime, isOpen = false, onClose }) {
  const { t } = useLanguage();

  const [showDownloadAll, setShowDownloadAll] = useState(true);
  const [showImportExport, setShowImportExport] = useState(true);

  const handleDownload = async (output) => {
    try {
      // Prefer blob if available (already downloaded)
      if (output.blob) {
        const url = URL.createObjectURL(output.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = output.name || 'voice-output.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      // Use persistent URL if available (from API)
      const audioUrl = output.persistentUrl || output.audioUrl;
      if (!audioUrl) {
        console.warn('No download URL available for output:', output);
        throw new Error('No download URL available');
      }

      // If it's a blob URL, try to fetch it
      if (audioUrl.startsWith('blob:')) {
        // For blob URLs, we can't download directly, so skip
        console.warn('Cannot download blob URL:', audioUrl);
        throw new Error('Cannot download blob URL');
      }

      // For HTTP/HTTPS URLs, fetch and download
      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = output.name || 'voice-output.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (fetchError) {
        // Fallback: try direct download link
        console.log('Fetch failed, trying direct download:', fetchError);
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = output.name || 'voice-output.mp3';
        a.target = '_blank'; // Open in new tab as fallback
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
      throw error; // Re-throw so handleDownloadAll can catch it
    }
  };

  const handleDownloadAll = async () => {
    if (!outputs || outputs.length === 0) {
      return;
    }

    // Filter out outputs that don't have a valid download source
    const downloadableOutputs = outputs.filter(output => {
      return output.blob || output.persistentUrl || output.audioUrl;
    });

    if (downloadableOutputs.length === 0) {
      console.warn('No downloadable outputs found');
      return;
    }

    console.log(`Starting download of ${downloadableOutputs.length} files`);

    // Download each file with a small delay to avoid browser blocking
    for (let index = 0; index < downloadableOutputs.length; index++) {
      const output = downloadableOutputs[index];
      try {
        await handleDownload(output);
        // Add delay between downloads to avoid browser blocking
        if (index < downloadableOutputs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error(`Error downloading file ${index + 1}:`, error);
        // Continue with next file even if one fails
      }
    }
  };

  return (
    <aside className={`
      fixed lg:relative inset-y-0 right-0
      flex flex-col shrink-0 z-50 lg:z-10
      w-[320px] lg:w-[260px] xl:w-[300px] 2xl:w-[340px] bg-[#eef2ff] text-white border-l border-white/10
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <h2 className="text-sm font-semibold tracking-wide text-black/80">
          {t("voicestudio.rightSidebar.outputDeck")}
        </h2>

        <div className="flex items-center gap-2">
          {/* Close button for mobile and tablet */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-black/60 transition-colors"
            aria-label="Close sidebar"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Download all voices (collapsible) */}
        <section className="px-5 py-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => setShowDownloadAll((s) => !s)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-black/80">
              {t("voicestudio.rightSidebar.downloadAllVoices")}
            </span>
            <span className="material-icons-round text-black/60 text-base">
              {showDownloadAll ? "expand_less" : "expand_more"}
            </span>
          </button>

          {showDownloadAll && (
            <div className="mt-4">
              <div className="flex items-start justify-between mb-3">
                <div />
                <div className="text-right text-black/80">
                  <p className="text-sm font-bold">0 {t("voicestudio.rightSidebar.points")}</p>
                  <p className="text-xs text-black/50">≈ 0.000 {t("voicestudio.rightSidebar.usd")}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={!outputs || outputs.length === 0}
                className="w-full h-11 rounded-xl bg-gradient-to-b from-blue-100 via-blue-200 to-purple-200 hover:from-blue-200 hover:via-blue-300 hover:to-purple-300 text-slate-800 border border-gray-300 transition-all flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <span className="material-icons-round text-slate-700">download</span>
                {t("voicestudio.rightSidebar.downloadAll")}
              </button>


              <button
  type="button"
  className="mt-3 w-full h-11 rounded-xl bg-cyan-100 hover:bg-cyan-200 border border-cyan-400 transition flex items-center justify-center gap-2 font-semibold"
>
  <span className="material-icons-round text-indigo-600">
    auto_awesome
  </span>

  <span
    style={{
      background: "linear-gradient(90deg, #1313ec 0%, #9333ea 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
  >
    {t("voicestudio.rightSidebar.automaticallyGenerate")}
  </span>
</button>



            </div>
          )}
        </section>

        {/* Import / Export (collapsible) */}
        <section className="px-5 py-5">
          <button
            type="button"
            onClick={() => setShowImportExport((s) => !s)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-black/80">
                {t("voicestudio.rightSidebar.importExport")}
              </span>
              <span className="material-icons-round text-black/40 text-sm">
                info
              </span>
            </div>

            <span className="material-icons-round text-black/60 text-base">
              {showImportExport ? "expand_less" : "expand_more"}
            </span>
          </button>

          {showImportExport && (
            <div className="mt-4 space-y-3">
              {/* Upload DOCX */}
              <label className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 font-semibold cursor-pointer">
                <span className="material-icons-round text-white">description</span>
                {t("voicestudio.rightSidebar.uploadFileDocx")}
                <input type="file" accept=".doc,.docx" className="hidden" />
              </label>

              {/* Upload CSV */}
              <label className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 font-semibold cursor-pointer">
                <span className="material-icons-round text-white">table_chart</span>
                {t("voicestudio.rightSidebar.uploadCsv")}
                <input type="file" accept=".csv" className="hidden" />
              </label>

              {/* Download CSV */}
              <button
                type="button"
                className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                <span className="material-icons-round text-white">download</span>
                {t("voicestudio.rightSidebar.downloadCsv")}
              </button>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
