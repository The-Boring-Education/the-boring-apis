"use strict";(()=>{var e={};e.id=3249,e.ids=[3249],e.modules={8097:e=>{e.exports=require("@sentry/nextjs")},2167:e=>{e.exports=require("axios")},3582:e=>{e.exports=require("cors")},1185:e=>{e.exports=require("mongoose")},1649:e=>{e.exports=require("next-auth/react")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},3160:e=>{e.exports=require("next/dist/lib/import-next-warning")},5828:e=>{e.exports=require("uuid")},6113:e=>{e.exports=require("crypto")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},1965:(e,t,i)=>{i.r(t),i.d(t,{config:()=>f,default:()=>u,routeModule:()=>x});var o={};i.r(o),i.d(o,{default:()=>c});var r=i(1802),a=i(7153),n=i(6249),s=i(5912),d=i(9276),l=i(5166),p=i(3506);let handler=async(e,t)=>{if(await (0,l.D0)(e,t),"OPTIONS"===e.method){t.status(200).end();return}if(await (0,p.uD)(),"POST"!==e.method)return t.status(s.uT.METHOD_NOT_ALLOWED).json((0,l.OF)({status:!1,message:`Method ${e.method} not allowed`}));try{let{userId:i,userEmail:o,userName:r}=e.body;if(!i||!o||!r)return t.status(s.uT.BAD_REQUEST).json((0,l.OF)({status:!1,message:"Missing required fields: userId, userEmail, userName"}));let a=`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Selected for Mentorship</title>
        <style>
          body { margin:0; padding:0; background:#f6f7fb; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji','Segoe UI Emoji', sans-serif; color:#111827; }
          .container { width:100%; max-width:640px; margin:0 auto; padding:24px 12px; }
          .card { background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 20px rgba(17,24,39,0.06); }
          .header { background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 50%, #0ea5e9 100%); padding:28px 24px; color:#fff; }
          .brand { font-weight:800; letter-spacing:0.3px; font-size:12px; opacity:0.95; text-transform:uppercase; }
          .title { margin:6px 0 0; font-size:24px; font-weight:800; line-height:1.2; }
          .content { padding:24px; }
          .pill { display:inline-block; background:#eef2ff; color:#4f46e5; border:1px solid #e0e7ff; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:600; }
          .section { margin-top:16px; line-height:1.65; color:#374151; }
          .list { margin:12px 0 0; padding:0; list-style:none; }
          .list li { margin:0; padding-left:22px; position:relative; font-size:14px; color:#374151; line-height:1.6; }
          .list li:before { content:'✔'; position:absolute; left:0; top:0; color:#10b981; font-weight:700; }
          .cta { display:inline-block; margin-top:20px; background:#4f46e5; color:#fff !important; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:700; font-size:14px; letter-spacing:0.2px; box-shadow:0 6px 16px rgba(79,70,229,0.35); }
          .note { margin-top:18px; font-size:12px; color:#6b7280; }
          .footer { text-align:center; color:#6b7280; font-size:12px; padding:20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="brand">The Boring Education</div>
              <div class="title">Congrats, ${r} — You're in! 🎉</div>
            </div>
            <div class="content">
              <span class="pill">Prep Yatra — Async Mentorship</span>
              <div class="section" style="margin-top:14px;">We’ve selected you for mentorship based on your consistency and growth in Prep Yatra. You’ll now receive timely nudges, guidance and resources tailored to your goals.</div>

              <div class="section">
                <strong>What to expect next:</strong>
                <ul class="list">
                  <li>Periodic check-ins and action prompts</li>
                  <li>Curated resources based on your current focus</li>
                  <li>Accountability to help you sustain your streak</li>
                </ul>
              </div>

              <a class="cta" href="#" target="_blank" rel="noopener">Keep up the momentum</a>
              <div class="note">You don’t need to reply to this email. We’ll reach out when an action is needed from your side.</div>
              <div class="section" style="margin-top:18px;">- Sachin from The Boring Education</div>
            </div>
          </div>
          <div class="footer">You received this because you are enrolled in Prep Yatra. \xa9 The Boring Education</div>
        </div>
      </body>
      </html>
    `,n=await d.emailClient.sendEmail({from_email:"theboringeducation@gmail.com",from_name:"TBE",to_email:o,to_name:r,subject:"You are selected for Prep Yatra Async Mentorship \uD83C\uDF89",html_content:a});if(!n.success)return t.status(s.uT.INTERNAL_SERVER_ERROR).json((0,l.OF)({status:!1,message:"Failed to send email",error:n.error}));return t.status(s.uT.OKAY).json((0,l.OF)({status:!0,message:"Notification email sent",data:n}))}catch(e){return t.status(s.uT.INTERNAL_SERVER_ERROR).json((0,l.OF)({status:!1,message:"Unexpected error",error:e}))}},c=handler,u=(0,n.l)(o,"default"),f=(0,n.l)(o,"config"),x=new r.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/v1/admin/mentorship/send-notification",pathname:"/api/v1/admin/mentorship/send-notification",bundlePath:"",filename:""},userland:o})},3506:(e,t,i)=>{i.d(t,{D0:()=>o.D0,uD:()=>o.uD,xM:()=>o.xM});var o=i(7750)}};var t=require("../../../../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),i=t.X(0,[4222,5912,5166,9276,7750],()=>__webpack_exec__(1965));module.exports=i})();