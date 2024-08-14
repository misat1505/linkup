import React, { PropsWithChildren } from "react";

export default function BgGradient({ children }: PropsWithChildren) {
  return (
    <div className="absolute inset-0 overflow-auto bg-gradient-to-r from-blue-500 to-white">
      {children}
    </div>
  );
}

// export default function BgGradient({ children }: PropsWithChildren) {
//   return (
//     <>
//       <img
//         src="/assets/bg.webp"
//         className="absolute inset-0 h-full w-full overflow-auto object-cover"
//       />
//       <div className="z-10">{children}</div>
//     </>
//   );
// }
