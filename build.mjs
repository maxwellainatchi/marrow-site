// Builds the public site into dist/. Plain file copy plus two substitutions:
//  - site.css gets Marrow Clinical tokens from vendor/tokens.css (copied from marrow-health packages/clinical), with the dark theme also applied by prefers-color-scheme.
//  - {{CONTACT}} and {{UPDATED}} in the HTML. The contact address is marrow@ainatchi.me unless MARROW_SITE_CONTACT
//    overrides it.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, copyFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const out = join(here, "dist");
const UPDATED = "November 24, 2026";

const contact = process.env.MARROW_SITE_CONTACT?.trim() || "marrow@ainatchi.me";
if (!/^[^\s@<>"]+@[^\s@<>"]+$/.test(contact)) throw new Error(`MARROW_SITE_CONTACT is not an email address: ${contact}`);
const contactHtml = `<a href="mailto:${contact}">${contact}</a>`;

const tokens = readFileSync(join(here, "vendor/tokens.css"), "utf8");
const dark = tokens.match(/\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1];
if (!dark) throw new Error("dark theme block not found in tokens.css");
const themed = `${tokens}\n@media (prefers-color-scheme: dark) { :root {${dark}} }\n`;

const layout = readFileSync(join(here, "layout.html"), "utf8");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const name of readdirSync(src)) {
  const from = join(src, name);
  if (name.endsWith(".html")) {
    // Each page starts with <!-- title: ... | desc: ... --> and is wrapped in layout.html.
    const page = readFileSync(from, "utf8");
    const meta = page.match(/^<!--\s*title:\s*(.*?)\s*\|\s*desc:\s*(.*?)\s*-->/);
    if (!meta) throw new Error(`${name}: missing title/desc comment`);
    const key = name.replace(/\.html$/, "") === "index" ? "home" : name.replace(/\.html$/, "");
    let html = layout
      .replace("{{TITLE}}", meta[1]).replace("{{DESC}}", meta[2])
      .replace("{{BODY}}", page.slice(meta[0].length).trim())
      .replace(/\{\{CUR_(\w+)\}\}/g, (_, k) => (k === key ? 'aria-current="page"' : ""))
      .replaceAll("{{CONTACT}}", contactHtml).replaceAll("{{UPDATED}}", UPDATED);
    writeFileSync(join(out, name), html);
  } else if (name === "site.css") {
    writeFileSync(join(out, name), `${themed}\n${readFileSync(from, "utf8")}`);
  } else if (name === ".well-known") {
    // GitHub Pages serves this as application/json with CORS open, which is what Epic needs.
    // Public key set for Epic's confidential-client JWT auth. Public keys only; never a private key.
    cpSync(from, join(out, name), { recursive: true });
  } else {
    copyFileSync(from, join(out, name));
  }
}
console.log(`site built to ${out} (contact ${contact})`);
