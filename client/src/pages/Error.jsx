// // import "../styles/error.css"
// import React from 'react'
// export const Error = () => {

//     return(<>

// {/* <!-- From Uiverse.io by Praashoo7 -->  */}
// <div class="main_wrapper">
//   <div class="main">
//     <div class="antenna">
//       <div class="antenna_shadow"></div>
//       <div class="a1"></div>
//       <div class="a1d"></div>
//       <div class="a2"></div>
//       <div class="a2d"></div>
//       <div class="a_base"></div>
//     </div>
//     <div class="tv">
//       <div class="cruve">
//         <svg
//           class="curve_svg"
//           version="1.1"
//           xmlns="http://www.w3.org/2000/svg"
//           xmlns:xlink="http://www.w3.org/1999/xlink"
//           viewBox="0 0 189.929 189.929"
//           xml:space="preserve"
//         >
//           <path
//             d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
//         C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
//           ></path>
//         </svg>
//       </div>
//       <div class="display_div">
//         <div class="screen_out">
//           <div class="screen_out1">
//             <div class="screen">
//               <span class="notfound_text"> NOT FOUND</span>
//             </div>
//             <div class="screenM">
//               <span class="notfound_text"> NOT FOUND</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div class="lines">
//         <div class="line1"></div>
//         <div class="line2"></div>
//         <div class="line3"></div>
//       </div>
//       <div class="buttons_div">
//         <div class="b1"><div></div></div>
//         <div class="b2"></div>
//         <div class="speakers">
//           <div class="g1">
//             <div class="g11"></div>
//             <div class="g12"></div>
//             <div class="g13"></div>
//           </div>
//           <div class="g"></div>
//           <div class="g"></div>
//         </div>
//       </div>
//     </div>
//     <div class="bottom">
//       <div class="base1"></div>
//       <div class="base2"></div>
//       <div class="base3"></div>
//     </div>
//   </div>
//   <div class="text_404">
//     <div class="text_4041">4</div>
//     <div class="text_4042">0</div>
//     <div class="text_4043">4</div>
//   </div>
// </div>


//     </>)

// }

import React from "react";

export const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* 404 Error TV Design */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-64 h-64 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center justify-center border-4 border-gray-700">
          <div className="absolute -top-5 w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="absolute -top-12 w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-red-500 animate-pulse">NOT FOUND</span>
          </div>
        </div>
        {/* TV Stand */}
        <div className="w-16 h-4 bg-gray-700 mt-4 rounded-md"></div>
      </div>
      {/* 404 Text */}
      <div className="mt-4 text-6xl font-extrabold text-red-500 flex space-x-2">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>
    </div>
  );
};