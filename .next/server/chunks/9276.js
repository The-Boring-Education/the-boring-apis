"use strict";exports.id=9276,exports.ids=[9276],exports.modules={9276:(e,t,r)=>{r.d(t,{emailClient:()=>n,aL:()=>o,uz:()=>sendCourseEnrollmentEmail,Rf:()=>sendInterviewPrepEnrollmentEmail,RD:()=>sendProjectEnrollmentEmail,Pi:()=>sendWelcomeEmail});var i=r(2167),a=r.n(i),s=r(5912);let n=new class{constructor(){this.apiUrl=s._c.EMAIL_SERVICE_URL,this.apiKey=s._c.EMAIL_API_KEY}async sendEmail(e,t){let r=t||s.jb.generateRequestId(),i=Date.now();try{if(!this.apiKey){let t=Error("Email API key not configured");throw s.jb.logError(r,e.to_email,t,"CONFIGURATION"),t}if(!this.apiUrl){let t=Error("Email service URL not configured");throw s.jb.logError(r,e.to_email,t,"CONFIGURATION"),t}s.jb.logApiCall(r,e.to_email,{apiUrl:this.apiUrl,subject:e.subject,hasApiKey:!!this.apiKey});let t=await a().post(`${this.apiUrl}/send-email`,e,{headers:{"Content-Type":"application/json","X-Breevo-API-Key":this.apiKey},timeout:1e4}),n=Date.now()-i;return s.jb.logSuccess(r,e.to_email,n,{httpStatus:t.status,responseData:t.data,subject:e.subject}),{success:!0,message:"Email sent successfully",requestId:r}}catch(a){let t=Date.now()-i;return s.jb.logError(r,e.to_email,a,"API_CALL",{duration:t,httpStatus:a.response?.status,httpStatusText:a.response?.statusText,responseData:a.response?.data,subject:e.subject,apiUrl:this.apiUrl,isTimeout:"ECONNABORTED"===a.code,isNetworkError:!a.response}),{success:!1,error:a.response?.data?.message||a.message||"Failed to send email",requestId:r}}}async sendBulkEmails(e){let t=await Promise.allSettled(e.map(e=>this.sendEmail(e)));return t.map(e=>"fulfilled"===e.status?e.value:{success:!1,error:"Failed to send email"})}},getBaseTemplate=e=>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Boring Education</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
        }
        .main-text {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 30px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .social-links {
            margin: 30px 0;
            text-align: center;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .signature-name {
            font-weight: 600;
            color: #2d3748;
        }
        .signature-title {
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 The Boring Education</h1>
            <p>Building Open Source Tech Education for Bharat 🇮🇳</p>
        </div>
        <div class="content">
            ${e}
            
            <div class="signature">
                <div class="signature-name">Sachin</div>
                <div class="signature-title">Co-founder, The Boring Education</div>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <a href="https://github.com/The-Boring-Education">GitHub</a>
                <a href="https://www.instagram.com/theboringeducation">Instagram</a>
                <a href="https://www.youtube.com/@TheBoringEducation">YouTube</a>
                <a href="https://prepyatra.theboringeducation.com/">Prep Yatra</a>
            </div>
            <p>
                \xa9 2025 The Boring Education. Building the future of tech education in India.<br>
                <a href="https://www.theboringeducation.com" style="color: #667eea;">www.theboringeducation.com</a>
            </p>
        </div>
    </div>
</body>
</html>
`,welcomeEmailTemplate=e=>{let t=`
    <div class="greeting">Hey ${e.userName}! 👋</div>
    
    <div class="main-text">
        Welcome to The Boring Education family! 🎉
        
        <br><br>
        
        I'm Sachin, and I'm thrilled to have you join our mission of making quality tech education accessible to everyone in Bharat. 
        
        <br><br>
        
        We're not just another ed-tech platform - we're a community of learners, builders, and dreamers who believe that education should be:
        <ul>
            <li>🆓 <strong>Free</strong> - Quality education shouldn't be behind paywalls</li>
            <li>🌟 <strong>Practical</strong> - Learn by building real projects</li>
            <li>🇮🇳 <strong>For Bharat</strong> - Designed specifically for Indian students</li>
        </ul>
        
        <br>
        
        Ready to start your journey? Explore our courses and begin building something amazing today!
    </div>
    
    <div style="text-align: center;">
        <a href="https://www.theboringeducation.com" class="cta-button">
            🚀 Start Learning Now
        </a>
    </div>
  `;return getBaseTemplate(t)},courseEnrollmentTemplate=e=>{let t=`
    <div class="greeting">Hey ${e.userName}! 📚</div>
    
    <div class="main-text">
        Congratulations on enrolling in <strong>${e.courseName}</strong>! 🎉
        
        <br><br>
        
        You've just taken a huge step towards mastering new skills. I'm genuinely excited to see you on this learning journey!
        
        <br><br>
        
        ${e.courseDescription?`<em>"${e.courseDescription}"</em><br><br>`:""}
        
        Here's what I recommend to make the most of this course:
        <ul>
            <li>📅 <strong>Set a schedule</strong> - Dedicate 30-60 minutes daily</li>
            <li>💪 <strong>Practice actively</strong> - Code along with every example</li>
            <li>🤝 <strong>Join the community</strong> - Connect with fellow learners</li>
            <li>🎯 <strong>Build projects</strong> - Apply what you learn immediately</li>
        </ul>
        
        Remember, the best way to learn is by doing. Don't just watch - build, experiment, and break things!
    </div>
    
    <div style="text-align: center;">
        <a href=${s._c.PLATFORM_URL+s._j.user.dashboard} class="cta-button">
            📖 Continue Learning
        </a>
    </div>
  `;return getBaseTemplate(t)},projectEnrollmentTemplate=e=>{let t=`
    <div class="greeting">Hey ${e.userName}! 🛠️</div>
    
    <div class="main-text">
        Awesome! You've enrolled in the <strong>${e.projectName}</strong> project! 🚀
        
        <br><br>
        
        This is where the real magic happens - you're not just learning, you're building something that matters. 
        
        <br><br>
        
        ${e.projectDescription?`<em>"${e.projectDescription}"</em><br><br>`:""}
        
        Here's how to ace this project:
        <ul>
            <li>🎯 <strong>Start small</strong> - Break the project into tiny, manageable tasks</li>
            <li>📝 <strong>Document everything</strong> - Your future self will thank you</li>
            <li>🐛 <strong>Embrace bugs</strong> - They're your best teachers</li>
            <li>🔄 <strong>Iterate fast</strong> - Build, test, improve, repeat</li>
            <li>🌟 <strong>Share your progress</strong> - The community loves to see your journey</li>
        </ul>
        
        Remember, every senior developer started with their first project. You're on the right path!
    </div>
    
    <div style="text-align: center;">
        <a href="${e.projectUrl}" class="cta-button">
            🔨 Start Building
        </a>
    </div>
  `;return getBaseTemplate(t)},interviewPrepEnrollmentTemplate=e=>getBaseTemplate(`
    <div class="greeting">Hello ${e.userName}! 👋</div>
    
    <div class="main-text">
      <p>Welcome to your Interview Prep journey! 🎯</p>
      
      <p>You've successfully enrolled in <strong>${e.sheetName}</strong>.</p>
      
      ${e.sheetDescription?`<p>${e.sheetDescription}</p>`:""}
      
      <p>This comprehensive interview preparation sheet will help you:</p>
      <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Master key concepts and algorithms</li>
        <li>Practice with real interview questions</li>
        <li>Build confidence for technical interviews</li>
        <li>Track your progress systematically</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href=${s._c.PLATFORM_URL+s._j.user.dashboard} class="cta-button">
        Start Your Interview Prep 🚀
      </a>
    </div>
    
    <div class="main-text">
      <p><strong>Pro Tips:</strong></p>
      <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Set aside dedicated time daily for practice</li>
        <li>Focus on understanding concepts, not just memorizing</li>
        <li>Practice coding problems regularly</li>
        <li>Review and revise completed topics</li>
      </ul>
    </div>
    
    <div class="signature">
      <div class="signature-name">Sachin from The Boring Education</div>
      <div class="signature-title">Your Interview Success Partners</div>
    </div>
  `),courseCompletionTemplate=e=>getBaseTemplate(`
    <div class="greeting">Congratulations ${e.userName}! 🎉</div>
    
    <div class="main-text">
      <p>You've successfully completed <strong>${e.courseName}</strong>!</p>
      
      <p>This is a significant milestone in your learning journey. You've demonstrated dedication, persistence, and a commitment to growth.</p>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #0369a1;">🎯 What You've Achieved:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Mastered course concepts and practical applications</li>
          <li>Completed all assignments and assessments</li>
          <li>Built real-world projects and skills</li>
          <li>Joined an elite group of course completers</li>
        </ul>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href=${s._c.PLATFORM_URL+s._j.user.dashboard} class="cta-button">
        Review Your Course 📚
      </a>
      ${e.certificateUrl?`
        <a href="${e.certificateUrl}" class="cta-button" style="margin-left: 10px; background: linear-gradient(135deg, #059669 0%, #047857 100%);">
          Download Certificate 🏆
        </a>
      `:""}
    </div>
    
    <div class="main-text">
      <p><strong>What's Next?</strong></p>
      <ul style="margin: 20px 0; padding-left: 20px;">
        <li>Apply your new skills to real projects</li>
        <li>Share your knowledge with the community</li>
        <li>Explore advanced courses in related topics</li>
        <li>Consider mentoring other learners</li>
      </ul>
      
      <p>Remember, learning is a continuous journey. Keep building, keep growing, and keep pushing your boundaries!</p>
    </div>
    
    <div class="signature">
      <div class="signature-name">Sachin from The Boring Education</div>
      <div class="signature-title">Proud of Your Achievement!</div>
    </div>
  `),o=new class{getDefaultFromEmail(){return s._c.FROM_EMAIL||"theboringeducation@gmail.com"}getDefaultFromName(){return"TBE"}async sendEmailWithTemplate(e,t,r,i){let a=s.jb.generateRequestId();try{let s=r(t),o={from_email:this.getDefaultFromEmail(),from_name:this.getDefaultFromName(),to_email:t.userEmail,to_name:t.userName,subject:i,html_content:s},l=await n.sendEmail(o,a);return{success:l.success,message:l.success?`${e} email sent successfully`:"Failed to send email",requestId:l.requestId,error:l.error}}catch(e){return s.jb.logError(a,t.userEmail,e,"TEMPLATE_GENERATION"),{success:!1,message:"Failed to send email",requestId:a,error:e.message||"Unknown error"}}}async sendTriggerEmail(e,t){switch(e){case"WELCOME":return this.sendEmailWithTemplate(e,t,welcomeEmailTemplate,"Welcome to The Boring Education! \uD83C\uDF89");case"COURSE_ENROLLMENT":return this.sendEmailWithTemplate(e,t,courseEnrollmentTemplate,`Welcome to ${t.courseName}! 🚀`);case"PROJECT_ENROLLMENT":return this.sendEmailWithTemplate(e,t,projectEnrollmentTemplate,`Welcome to ${t.projectName}! 🛠️`);case"INTERVIEW_PREP_ENROLLMENT":return this.sendEmailWithTemplate(e,t,interviewPrepEnrollmentTemplate,`Welcome to ${t.sheetName}! 🎯`);case"COURSE_COMPLETION":return this.sendEmailWithTemplate(e,t,courseCompletionTemplate,`Congratulations! You've completed ${t.courseName}! 🏆`);default:return{success:!1,message:`Unsupported email trigger: ${e}`,error:"Invalid email trigger type",requestId:void 0}}}async sendExternalEmail(e){let{emailType:t,userData:r,additionalData:i}=e;try{if(!r.email||!r.name||!r.id)return{success:!1,message:"Missing required user data: email, name, or id",error:"INVALID_USER_DATA"};let e={userEmail:r.email,userName:r.name,userId:r.id,metadata:i||{}},a=e;switch(t){case"WELCOME":a=e;break;case"COURSE_ENROLLMENT":if(!i?.courseName)return{success:!1,message:"Missing required course data: courseName",error:"INVALID_COURSE_DATA"};a={...e,courseName:i.courseName,courseDescription:i.courseDescription};break;case"PROJECT_ENROLLMENT":if(!i?.projectName)return{success:!1,message:"Missing required project data: projectName",error:"INVALID_PROJECT_DATA"};a={...e,projectName:i.projectName,projectDescription:i.projectDescription};break;case"INTERVIEW_PREP_ENROLLMENT":if(!i?.sheetName)return{success:!1,message:"Missing required sheet data: sheetName",error:"INVALID_SHEET_DATA"};a={...e,sheetName:i.sheetName,sheetDescription:i.sheetDescription};break;case"COURSE_COMPLETION":if(!i?.courseName||!i?.completionDate)return{success:!1,message:"Missing required completion data: courseName, completionDate",error:"INVALID_COMPLETION_DATA"};a={...e,courseName:i.courseName,completionDate:i.completionDate,certificateUrl:i.certificateUrl};break;default:return{success:!1,message:`Unsupported email type: ${t}`,error:"INVALID_EMAIL_TYPE"}}let s=await this.sendTriggerEmail(t,a);return{success:s.success,message:s.message||"Email processed",requestId:s.requestId||void 0,error:s.error}}catch(e){return{success:!1,message:"Failed to process email request",error:e.message||"Unknown error"}}}},sendWelcomeEmail=async e=>{let t={emailType:"WELCOME",userData:{email:e.email,name:e.name,id:e.id}};return o.sendExternalEmail(t)},sendCourseEnrollmentEmail=async e=>{let t={emailType:"COURSE_ENROLLMENT",userData:{email:e.email,name:e.name,id:e.id},additionalData:{courseName:e.courseName,courseDescription:e.courseDescription}};return o.sendExternalEmail(t)},sendProjectEnrollmentEmail=async e=>{let t={emailType:"PROJECT_ENROLLMENT",userData:{email:e.email,name:e.name,id:e.id},additionalData:{projectName:e.projectName,projectDescription:e.projectDescription}};return o.sendExternalEmail(t)},sendInterviewPrepEnrollmentEmail=async e=>{let t={emailType:"INTERVIEW_PREP_ENROLLMENT",userData:{email:e.email,name:e.name,id:e.id},additionalData:{sheetName:e.sheetName,sheetDescription:e.sheetDescription}};return o.sendExternalEmail(t)}}};