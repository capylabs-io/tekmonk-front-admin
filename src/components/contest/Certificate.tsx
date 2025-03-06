"use client";

export const Certificate = ({
  name,
  progress,
  course,
}: {
  name: string;
  progress: number;
  course: string;
}) => {
  return (
    <>
      <div
        className={`bg-[url('/image/contest/Certificate.png?height=400&width=600')] 
                                bg-no-repeat !bg-center bg-contain
                                w-[97%] min-w-[200px] mx-auto pt-4 sm:px-8 relative
                                px-6 
                                `}
        style={{
          aspectRatio: "16 / 9",
        }}
      >
        {/* absolute top-[10%] -translate-x-1/2 left-1/2 */}
        <div
          className="absolute top-[10%] -translate-x-1/2 left-1/2 text-primary-950 flex flex-col items-center
                       justify-center gap-y-2 w-full 
                       max-[600px]:gap-y-0
                       max-[600px]:justify-start

                       max-[500px]:gap-y-0
                       max-[400px]:h-[60px]
                       "
        >
          <div
            className="text-SubheadMd text-center items-center flex


                        max-[600px]:text-[12px]
                        max-[420px]:text-[10px]
                        max-[360px]:h-[16px]
                        

                        "
          >
            CHÚC MỪNG
          </div>
          <div
            className="text-Subhead3Xl uppercase h-[30px] text-center items-center flex
                        max-[600px]:!text-[18px]
                        max-[420px]:!text-[14px]
                        max-[420px]:h-[20px]
                        max-[360px]:h-[16px]
                         "
          >
            {name}
          </div>
          <div
            className="text-bodyLg  
                        max-[600px]:text-[12px]
                        "
          >
            Đã hoàn thành khóa {course}
          </div>
          {/* <div>Khóa học: {course}</div> */}
        </div>
        <div
          className="w-full text-Subhead4Xl text-primary-950 text-center mt-[32%] 
                      
                        max-[650px]:text-[26px]
                        max-[650px]:mt-[30%]
                        max-[560px]:mt-[30%]
                        max-[500px]:text-[24px]
                        max-[500px]:mt-[28%]
                        max-[440px]:mt-[26%]                        

                        max-[375px]:mt-[24%]                        
                        max-[375px]:text-[20px]
                        
                        max-[320px]:mt-[22%]
                        max-[320px]:text-[18px]
                      "
        >
          {progress}
        </div>
      </div>
    </>
  );
};
