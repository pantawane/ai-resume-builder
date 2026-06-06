import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';

const ResumePreview = ({data, template, accentColor, classes = ""}) => {

    // #region agent log
    React.useEffect(()=>{fetch('http://127.0.0.1:7658/ingest/cf3fbddf-0711-46df-9693-4bb2801c8461',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0e337a'},body:JSON.stringify({sessionId:'0e337a',location:'ResumePreview.jsx',message:'preview render',data:{template,hasImage:!!data?.personal_info?.image,imageType:typeof data?.personal_info?.image,imageValue:typeof data?.personal_info?.image==='string'?data.personal_info.image.substring(0,60):'(file-object)'},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});},[data?.personal_info?.image,template]);
    // #endregion

    const renderTemplate = () => {
        switch(template){
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor} />;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor} />;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor} />;

                default:
                  return <ClassicTemplate data={data} accentColor={accentColor} />;
        }
    }


  return (
    <div className='w-full bg-gray-100'>
      <div id="resume-preview" className={"border border-gray-200 print:shadow-none print:border-none " + classes}>
        {renderTemplate()}
      </div>

      <style jsx>
        {`
        @page {
        size: letter;
        margin: 0;
        }
        @media print{
         html, body {
         width: 8.5in;
            height: 11in;
            overflow: hidden;
         }
            body * {
              visibility: hidden;
        }
              #resume-preview, #resume-preview * {
                visibility: visible;
              }
                #resume-preview {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: auto;
                  margin: 0;
                  padding: 0;
                  box-shadow: none !important;
                  border: none !important;
                  }
        }
        `}
      </style>
    </div>
  )
}

export default ResumePreview
