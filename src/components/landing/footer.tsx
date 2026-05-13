import { CS } from "@/lib/cs";
import { CSMark } from "@/components/cs/cs-mark";
import { CSCopy } from "./copy";

export function LandingFooter() {
  return (
    <footer
      className="flex flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-16"
      style={{ borderTop: `1px solid ${CS.rule2}` }}
    >
      <div className="flex flex-wrap items-center gap-3.5">
        <CSMark size={20} />
        <span
          className="font-sans"
          style={{ fontSize: 14, color: CS.ink, letterSpacing: "-0.02em" }}
        >
          commonsquare
        </span>
        <span className="font-sans" style={{ fontSize: 14, color: CS.mute }}>
          · {CSCopy.footer.tag}
        </span>
      </div>
      <div className="flex flex-wrap gap-5">
        {CSCopy.footer.links.map((l) => (
          <span
            key={l}
            className="font-sans"
            style={{ fontSize: 13, color: CS.mute }}
          >
            {l}
          </span>
        ))}
      </div>
    </footer>
  );
}
