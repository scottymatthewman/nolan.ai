(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{5371:function(e,r,t){Promise.resolve().then(t.bind(t,9871))},9871:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return b}});var s=t(7437),a=t(2265),n=t(4949),o=t(6061),i=t(7042),d=t(4769);function l(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return(0,d.m6)((0,i.W)(r))}let u=(0,o.j)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),c=a.forwardRef((e,r)=>{let{className:t,variant:a,size:o,asChild:i=!1,...d}=e,c=i?n.g7:"button";return(0,s.jsx)(c,{className:l(u({variant:a,size:o,className:t})),ref:r,...d})});c.displayName="Button";let f=a.forwardRef((e,r)=>{let{className:t,type:a,...n}=e;return(0,s.jsx)("input",{type:a,className:l("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",t),ref:r,...n})});f.displayName="Input";let v=(0,o.j)("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),g=a.forwardRef((e,r)=>{let{className:t,variant:a,...n}=e;return(0,s.jsx)("div",{ref:r,role:"alert",className:l(v({variant:a}),t),...n})});g.displayName="Alert";let p=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("h5",{ref:r,className:l("mb-1 font-medium leading-none tracking-tight",t),...a})});p.displayName="AlertTitle";let m=a.forwardRef((e,r)=>{let{className:t,...a}=e;return(0,s.jsx)("div",{ref:r,className:l("text-sm [&_p]:leading-relaxed",t),...a})});m.displayName="AlertDescription";var h=t(811),x=t(8549);function b(){let[e,r]=(0,a.useState)(""),[t,n]=(0,a.useState)({status:"idle"}),o=async r=>{r.preventDefault(),n({status:"loading"});try{let r=await fetch("/api/generate-video",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:e})}),t=r.headers.get("content-type");if(t&&t.includes("application/json")){let e=await r.json();if(!r.ok)throw Error(e.error||"Failed to generate video");throw Error("Unexpected JSON response from server")}if(t&&t.includes("video/mp4")){let e=await r.blob(),t=URL.createObjectURL(e);n({status:"success",videoUrl:t})}else throw Error("Unexpected response type: ".concat(t))}catch(e){console.error("Error in video generation:",e),n({status:"error",error:e instanceof Error?e.message:"An unexpected error occurred"})}};return(0,s.jsxs)("div",{className:"w-full max-w-md space-y-4",children:[(0,s.jsxs)("form",{onSubmit:o,className:"space-y-4",children:[(0,s.jsx)(f,{type:"url",value:e,onChange:e=>r(e.target.value),placeholder:"Enter Figma prototype URL",required:!0,disabled:"loading"===t.status}),(0,s.jsx)(c,{type:"submit",disabled:"loading"===t.status,className:"w-full",children:"loading"===t.status?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(h.Z,{className:"mr-2 h-4 w-4 animate-spin"}),"Generating Video..."]}):"Generate Demo Video"})]}),"error"===t.status&&(0,s.jsxs)(g,{variant:"destructive",children:[(0,s.jsx)(x.Z,{className:"h-4 w-4"}),(0,s.jsx)(m,{children:t.error})]}),"success"===t.status&&t.videoUrl&&(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsx)(g,{children:(0,s.jsx)(m,{children:"Your Nolan AI demo video has been generated successfully!"})}),(0,s.jsx)("div",{className:"rounded-lg overflow-hidden border",children:(0,s.jsx)("video",{src:t.videoUrl,controls:!0,className:"w-full",poster:"/placeholder.svg?height=400&width=600"})}),(0,s.jsx)(c,{asChild:!0,className:"w-full",children:(0,s.jsx)("a",{href:t.videoUrl,download:"nolan-ai-demo.mp4",children:"Download Video"})})]})]})}}},function(e){e.O(0,[771,971,596,744],function(){return e(e.s=5371)}),_N_E=e.O()}]);