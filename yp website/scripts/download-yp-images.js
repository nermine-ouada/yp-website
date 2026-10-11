// Downloads every yp.ieee.tn image the site uses.
//
// yp.ieee.tn blocks scripted downloads (Cloudflare), so run this from a
// browser that is already on the site:
//   1. Open https://yp.ieee.tn in Chrome/Edge and wait for it to load.
//   2. Open DevTools (F12) > Console, paste this whole file, press Enter.
//   3. Allow "download multiple files" if the browser asks.
//   4. Move the 28 downloaded files into "yp website/public/yp/".
//
// Generated from src/data/ypTunisia.ts (REMOTE_IMAGES).

(async () => {
  const urls = [
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/491631881_122130697676786843_5489825640158908662_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/aaa.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/489331492_675391451708522_8905115526458508545_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/519834017_122137736696741380_358579834761898064_n-scaled-e1753123557491.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/zzzz.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/aaaaa.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/rerer.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/erere.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/rere.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/476798196_949685383979046_3593289821925028506_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/481957630_957992773148307_6171452945999709663_n-1-scaled.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/480820904_959410756339842_3212020303742050075_n-scaled.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/318432039_5657538060992875_6931580335118631052_n.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/489331492_675391451708522_8905115526458508545_n-scaled.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/473346272_524057277322591_5026724097766316840_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/484284830_4386243764935533_4018526715585478563_n-scaled.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/dfgfd-scaled.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/srgrs-scaled.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2025/07/szasz.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2019/06/Photo-Group.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2019/06/Coffee-Break.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2019/06/56913366_2319934291586725_7394707028167360512_n.png",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2018/04/29542283_203075430289872_4040669896441975824_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2018/04/29572595_203322060265209_1094369935387760338_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2018/04/18700060_203073976956684_4358145148105934870_n.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2012/02/women.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2012/02/robo.jpg",
    "https://yp.ieee.tn/wp-content/uploads/sites/165/2012/02/wro2015.jpg"
  ];
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) { console.warn("failed", res.status, url); continue; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(await res.blob());
    a.download = url.split("/").pop();
    a.click();
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log("done");
})();
