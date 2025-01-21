"use strict";
(() => {
var exports = {};
exports.id = 421;
exports.ids = [421];
exports.modules = {

/***/ 4300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 7561:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 4492:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 2477:
/***/ ((module) => {

module.exports = require("node:stream/web");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 5477:
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 1267:
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ 9796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 6621:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/generate-video/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(2394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9692);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(9335);
;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = require("child_process");
// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(3837);
;// CONCATENATED MODULE: external "fs/promises"
const promises_namespaceObject = require("fs/promises");
var promises_default = /*#__PURE__*/__webpack_require__.n(promises_namespaceObject);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(1017);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
// EXTERNAL MODULE: ./node_modules/openai/index.mjs + 70 modules
var openai = __webpack_require__(4491);
// EXTERNAL MODULE: ./node_modules/uuid/dist/esm-node/v4.js + 3 modules
var v4 = __webpack_require__(1063);
;// CONCATENATED MODULE: ./app/api/generate-video/route.ts







const execAsync = (0,external_util_.promisify)(external_child_process_namespaceObject.exec);
const route_openai = new openai/* default */.ZP({
    apiKey: process.env.OPENAI_API_KEY
});
const TEMP_DIR = "/tmp";
const OUTPUT_DIR = "/tmp";
const FRAME_RATE = 30;
const RECORDING_DURATION = 10 // seconds
;
async function POST(req) {
    try {
        const { url } = await req.json();
        if (!url) {
            return next_response/* default */.Z.json({
                error: "Figma prototype URL is required"
            }, {
                status: 400
            });
        }
        const videoId = (0,v4/* default */.Z)();
        const outputPath = external_path_default().join(OUTPUT_DIR, `${videoId}.mp4`);
        // 1. Navigate and record the Figma prototype
        const frames = await navigateAndRecordPrototype(url, videoId);
        // 2. Analyze frames to determine important moments
        const analysis = await analyzeFrames(frames);
        // 3. Generate video with smart zooms
        const videoBuffer = await generateVideo(frames, analysis, outputPath);
        // 4. Clean up temporary files
        await Promise.all(frames.map((frame)=>promises_default().unlink(frame)));
        await promises_default().unlink(outputPath).catch(()=>{});
        return new Response(videoBuffer, {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": 'attachment; filename="nolan-ai-demo.mp4"'
            }
        });
    } catch (error) {
        console.error("Error generating video:", error);
        return next_response/* default */.Z.json({
            error: error instanceof Error ? error.message : "Failed to generate video"
        }, {
            status: 500
        });
    }
}
async function navigateAndRecordPrototype(url, videoId) {
    const browserlessApiKey = process.env.BROWSERLESS_API_KEY;
    if (!browserlessApiKey) {
        throw new Error("BROWSERLESS_API_KEY is not set");
    }
    const frames = [];
    const startTime = Date.now();
    while(Date.now() - startTime < RECORDING_DURATION * 1000){
        const response = await fetch("https://chrome.browserless.io/screenshot", {
            method: "POST",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                Authorization: `Bearer ${browserlessApiKey}`
            },
            body: JSON.stringify({
                url,
                options: {
                    fullPage: false,
                    type: "png",
                    encoding: "base64"
                }
            })
        });
        if (!response.ok) {
            throw new Error(`Failed to capture screenshot: ${response.statusText}`);
        }
        const result = await response.json();
        const screenshot = result.data;
        const framePath = external_path_default().join(TEMP_DIR, `${videoId}-frame-${frames.length}.png`);
        await promises_default().writeFile(framePath, screenshot, "base64");
        frames.push(framePath);
        // Simulate interaction (in a real scenario, you'd need to implement this on Browserless)
        await new Promise((resolve)=>setTimeout(resolve, 1000 / FRAME_RATE));
    }
    return frames;
}
async function analyzeFrames(frames) {
    const imageBuffers = await Promise.all(frames.map((frame)=>promises_default().readFile(frame)));
    const analysis = await route_openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze these frames from a Figma prototype and identify key moments or interactions. For each important frame, provide an object with 'frameIndex', 'description', and 'zoomArea' (an object with 'x', 'y', 'width', and 'height' as percentages of the frame). Return the results as a JSON array."
                    }
                ]
            }
        ],
        max_tokens: 1000
    });
    const content = analysis.choices[0].message.content;
    if (!content) {
        throw new Error("Failed to analyze frames");
    }
    return JSON.parse(content);
}
async function generateVideo(frames, analysis, outputPath) {
    const frameList = external_path_default().join(TEMP_DIR, "frames.txt");
    await promises_default().writeFile(frameList, frames.map((f)=>`file '${f}'`).join("\n"));
    const zoomFilters = analysis.map((item)=>{
        const { frameIndex, zoomArea } = item;
        const startTime = frameIndex / FRAME_RATE;
        const endTime = (frameIndex + 1) / FRAME_RATE;
        return `zoompan=z='if(between(t,${startTime},${endTime}),1.5,1)':x='if(between(t,${startTime},${endTime}),${zoomArea.x}*iw,0)':y='if(between(t,${startTime},${endTime}),${zoomArea.y}*ih,0)':d=1:s=1920x1080`;
    }).join(",");
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${frameList} -filter_complex "${zoomFilters}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${outputPath}`;
    try {
        await execAsync(ffmpegCommand);
        return await promises_default().readFile(outputPath);
    } catch (error) {
        throw new Error("Failed to generate video with FFmpeg");
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fgenerate-video%2Froute&name=app%2Fapi%2Fgenerate-video%2Froute&pagePath=private-next-app-dir%2Fapi%2Fgenerate-video%2Froute.ts&appDir=%2FUsers%2Fscottymatthewman%2FProjects%2Fnolan.ai%2Fapp&appPaths=%2Fapi%2Fgenerate-video%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/api/generate-video/route","pathname":"/api/generate-video","filename":"route","bundlePath":"app/api/generate-video/route"},"resolvedPagePath":"/Users/scottymatthewman/Projects/nolan.ai/app/api/generate-video/route.ts","nextConfigOutput":""}
    const routeModule = new (module_default())({
      ...options,
      userland: route_namespaceObject,
    })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/generate-video/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [212,713], () => (__webpack_exec__(6621)));
module.exports = __webpack_exports__;

})();