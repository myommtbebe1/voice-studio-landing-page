export default function Header({
  projectName = "Project 1",
  points = 2000,
  language = "EN",
  onChangeLanguage,
  onClickSettings,
  onClickNotifications,
  onClickProfile,
  onClickPoints,
}) {
  return (
    <header className="h-16 bg-[#1b2333] text-white flex items-center px-5 border-b border-white/10">
      {/* Left: Logo + Brand + Project */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-red-400 shrink-0" />

        <div className="flex items-center gap-3 min-w-0">
          <div className="text-lg font-semibold whitespace-nowrap">
            Botnoi <span className="text-indigo-400">Voice</span>
          </div>

          <div className="h-6 w-px bg-white/15" />

          <div className="text-base text-white/80 truncate">{projectName}</div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Points */}
        <button
          type="button"
          onClick={onClickPoints}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
          title="Points"
        >
          <span className="text-yellow-300">★</span>
          <span className="font-semibold">{points.toLocaleString()} Point</span>
          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-white/80">
            +
          </span>
        </button>

        {/* Language */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/10 border border-white/10">
          <span className="material-icons-round text-base text-white/70">
            flag
          </span>

          <select
            value={language}
            onChange={(e) => onChangeLanguage?.(e.target.value)}
            className="bg-transparent text-sm text-white outline-none"
          >
            <option className="text-black" value="EN">
              EN
            </option>
            <option className="text-black" value="MY">
              MY
            </option>
            <option className="text-black" value="TH">
              TH
            </option>
            <option className="text-black" value="JP">
              JP
            </option>
          </select>
        </div>

        {/* Settings */}
        <button
          type="button"
          onClick={onClickSettings}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center"
          title="Settings"
        >
          <span className="material-icons-round">settings</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onClickNotifications}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center"
          title="Notifications"
        >
          <span className="material-icons-round">notifications</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={onClickProfile}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center"
          title="Profile"
        >
          <span className="material-icons-round">person</span>
        </button>
      </div>
    </header>
  );
}
