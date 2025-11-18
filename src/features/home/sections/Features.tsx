// / Features.jsx
import React from "react";
// import { Image as LImage, Layers, Link, Share2, Workflow } from "lucide-react";

export function Features1() {
  return (
    <section className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 py-10 md:py-16 items-center max-w-7xl mx-auto px-4 -z-10">
      <div className="space-y-3 md:space-y-4 max-w-xl mx-auto md:mx-0 order-2 md:order-1">
        <h3 className="font-cardo text-primary leading-tight">
          Don&apos;t do it alone, invite your relatives to help.
        </h3>
        <p>Invite relatives to share stories, photos, and memories to build your shared heritage</p>
      </div>

      <div className=" rounded-2xl border-2 overflow-hidden w-full aspect-video order-1 md:order-2">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videos/Collaboration.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
export function Features2() {
  return (
    <section className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 py-10 md:py-16 items-center lg:max-w-7xl mx-auto px-4">
      <div className=" rounded-2xl border-2 overflow-hidden w-full aspect-video">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videos/connect.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-xl mx-auto md:mx-0">
        <h3 className="font-cardo text-primary leading-tight">
          Your relative maybe on Osisi, search for them.
        </h3>
        <p>Search for family members across the platform and link them to your tree.</p>
      </div>
    </section>
  );
}

export function Features3() {
  return (
    <section className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 py-10 md:py-16 items-center max-w-7xl mx-auto px-4">
      <div className="space-y-3 md:space-y-4 max-w-xl mx-auto md:mx-0 order-2 md:order-1">
        <h3 className="font-cardo text-primary leading-tight">
          Your family can contribute without signing up. Send them the form.
        </h3>
        <p>
          Create temporary links for relatives to securely add their information without signing up on osisi.
        </p>
      </div>

      <div className=" rounded-2xl border-2 overflow-hidden w-full aspect-video order-1 md:order-2">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videos/connect.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
export function Features4() {
  return (
    <section className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 py-10 md:py-16 items-center lg:max-w-7xl mx-auto px-4">
      <div className=" rounded-2xl border-2 overflow-hidden w-full aspect-video">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videos/relative.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-xl mx-auto md:mx-0">
        <h3 className="font-cardo text-primary leading-tight">
          Find out how you&apos;re connected to that cousin.
        </h3>
        <p>Select any 2 family members and see how they are related.</p>
      </div>
    </section>
  );
}
// export default function Features() {
//   return (
//     <section id="features" className="py-20 max-w-7xl mx-auto">
//       <div className="container mx-auto px-4 ">
//         <div className=" mb-8">
//           <h2 className="text-primary mb-4 text-center">We make it easy to build your family tree.</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {/* Build on Existing Families */}
//           <div>
//             <div className="bg-primary/20 p-3 rounded-full w-fit mb-4">
//               <Layers className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Expand from Existing Families</h3>
//             <p>Discover families already on Osisi and grow your own family tree from them.</p>
//           </div>

//           {/* Connect Family Members */}
//           <div>
//             <div className="bg-primary/20 p-3 rounded-full w-fit mb-4">
//               <Workflow className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Connect Missing Relatives</h3>
//             <p>Search for family members across the platform and link them to your tree.</p>
//           </div>

//           {/* Family Collaboration */}
//           <div>
//             <div className="bg-primary/20 p-3 rounded-full w-fit mb-4">
//               <Share2 className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Collaborate with Family</h3>
//             <p>Invite relatives to share stories, photos, and memories to build your shared heritage.</p>
//           </div>

//           {/* Contribution Links */}
//           <div>
//             <div className="bg-primary/20 p-3 rounded-full w-fit mb-4">
//               <Link className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Easy Contribution Links</h3>
//             <p>Create temporary links for relatives to securely add their information.</p>
//           </div>

//           {/* Share Family Tree */}
//           <div>
//             <div className="bg-primary/20 p-3 rounded-full w-fit mb-4">
//               <LImage className="h-6 w-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Share Your Family Tree</h3>
//             <p>Download and share a beautiful image of your tree with loved ones.</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
