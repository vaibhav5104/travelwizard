// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as THREE from 'three';
// import earthBump from '../assets/8081_earthmap4k.jpg'

// export const Home = () => {
//   const navigate = useNavigate();
//   const [scrollY, setScrollY] = useState(0);
//   const parallaxRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);
//   const globeContainerRef = useRef(null);
//   const globeSceneRef = useRef(null);
  

//   // Handle parallax effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };

//     // Set initial visibility after a short delay for entrance animation
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearTimeout(timer);
//     };
//   }, []);

//   // Observer for scroll animations
//   useEffect(() => {
//     const observerOptions = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.1
//     };

//     const observerCallback = (entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('animate-reveal');
//         }
//       });
//     };

//     const observer = new IntersectionObserver(observerCallback, observerOptions);
    
//     const sections = document.querySelectorAll('.observe-section');
//     sections.forEach(section => {
//       observer.observe(section);
//     });

//     return () => {
//       sections.forEach(section => {
//         observer.unobserve(section);
//       });
//     };
//   }, []);

//   // // Initialize and handle the 3D globe
//   useEffect(() => {
//     if (!globeContainerRef.current) return;

//     // Initialize Three.js scene
//     const container = globeContainerRef.current;
//     const width = 250;
//     const height = 250;

//     // Create scene
//     const scene = new THREE.Scene();
    
//     // Create camera
//     const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
//     camera.position.z = 1.5;
    
//     // Create renderer
//     const renderer = new THREE.WebGLRenderer({ 
//       antialias: true,
//       alpha: true
//     });
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
    
//     // Clear container and add renderer
//     while (container.firstChild) {
//       container.removeChild(container.firstChild);
//     }
//     container.appendChild(renderer.domElement);
    
//     // Add ambient light
//     const ambientLight = new THREE.AmbientLight(0x404040, 1);
//     scene.add(ambientLight);
    
//     // Add directional light
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 3, 5);
//     scene.add(directionalLight);
    
//     // Create Earth globe
//     const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    
//     // Create texture loader
//     const textureLoader = new THREE.TextureLoader();
    
//     // Create globe materials
//     const globeMaterial = new THREE.MeshPhongMaterial({
//       map: textureLoader.load(`${earthBump}`),
//       bumpMap: textureLoader.load(`${earthBump}`),
//       bumpScale: 0.05,
//       specularMap: textureLoader.load(`${earthBump}`),
//       specular: new THREE.Color(0x333333),
//       shininess: 5
//     });
    
//     // Create globe mesh
//     const globe = new THREE.Mesh(sphereGeometry, globeMaterial);
//     scene.add(globe);
    
//     // Create atmosphere glow
//     const atmosphereGeometry = new THREE.SphereGeometry(0.53, 32, 32);
//     const atmosphereMaterial = new THREE.MeshPhongMaterial({
//       color: 0x1E90FF,
//       transparent: true,
//       opacity: 0.2,
//       side: THREE.BackSide
//     });
//     const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
//     scene.add(atmosphere);
    
//     // Create a group to hold all elements that should rotate together
//     const globeGroup = new THREE.Group();
//     globeGroup.add(globe);
//     globeGroup.add(atmosphere);
//     scene.add(globeGroup);
    
//     // Variables for rotation
//     let isDragging = false;
//     let previousMousePosition = {
//       x: 0,
//       y: 0
//     };
    
//     // Mouse down event
//     const onMouseDown = (e) => {
//       isDragging = true;
      
//       const { clientX, clientY } = getEventCoordinates(e);
//       previousMousePosition = {
//         x: clientX,
//         y: clientY
//       };
//     };
    
//     // Mouse move event
//     const onMouseMove = (e) => {
//       if (!isDragging) return;
      
//       const { clientX, clientY } = getEventCoordinates(e);
//       const deltaMove = {
//         x: clientX - previousMousePosition.x,
//         y: clientY - previousMousePosition.y
//       };
      
//       // Rotate the globe based on mouse movement
//       const deltaRotationQuaternion = new THREE.Quaternion()
//         .setFromEuler(new THREE.Euler(
//           toRadians(deltaMove.y * 0.5),
//           toRadians(deltaMove.x * 0.5),
//           0,
//           'XYZ'
//         ));
      
//       globeGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, globeGroup.quaternion);
      
//       previousMousePosition = {
//         x: clientX,
//         y: clientY
//       };
//     };
    
//     // Helper function to get event coordinates for both mouse and touch events
//     const getEventCoordinates = (event) => {
//       if (event.touches && event.touches.length > 0) {
//         return {
//           clientX: event.touches[0].clientX,
//           clientY: event.touches[0].clientY
//         };
//       }
//       return {
//         clientX: event.clientX,
//         clientY: event.clientY
//       };
//     };
    
//     // Mouse up event
//     const onMouseUp = () => {
//       isDragging = false;
//     };
    
//     // Touch events
//     const onTouchStart = (e) => onMouseDown(e);
//     const onTouchMove = (e) => onMouseMove(e);
//     const onTouchEnd = () => onMouseUp();
    
//     // Helper function to convert degrees to radians
//     const toRadians = (angle) => {
//       return angle * (Math.PI / 180);
//     };
    
//     // Add event listeners
//     renderer.domElement.addEventListener('mousedown', onMouseDown, false);
//     renderer.domElement.addEventListener('mousemove', onMouseMove, false);
//     renderer.domElement.addEventListener('mouseup', onMouseUp, false);
//     renderer.domElement.addEventListener('mouseleave', onMouseUp, false);
    
//     // Touch support
//     renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true });
//     renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: true });    
//     renderer.domElement.addEventListener('touchend', onTouchEnd, false);
    
//     // Auto rotation when not interacting
//     let autoRotate = true;
    
//     // Animate the scene
//     const animate = () => {
//       requestAnimationFrame(animate);
      
//       // Auto rotate when not dragging
//       if (!isDragging && autoRotate) {
//         globeGroup.rotation.y += 0.002;
//       }
      
//       renderer.render(scene, camera);
//     };
    
//     animate();
    
//     // Add slight tilt for realism
//     globeGroup.rotation.x = toRadians(15);
    
//     // Store ref to cleanup
//     globeSceneRef.current = {
//       renderer,
//       cleanup: () => {
//         renderer.domElement.removeEventListener('mousedown', onMouseDown);
//         renderer.domElement.removeEventListener('mousemove', onMouseMove);
//         renderer.domElement.removeEventListener('mouseup', onMouseUp);
//         renderer.domElement.removeEventListener('mouseleave', onMouseUp);
//         renderer.domElement.removeEventListener('touchstart', onTouchStart);
//         renderer.domElement.removeEventListener('touchmove', onTouchMove);
//         renderer.domElement.removeEventListener('touchend', onTouchEnd);
//       }
//     };
    
//     // Return cleanup function
//     return () => {
//       if (globeSceneRef.current) {
//         globeSceneRef.current.cleanup();
//       }
//     };
//   }, []);


//   const images = {
//     paris: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     newYork: "https://images.unsplash.com/photo-1476837754190-8036496cea40?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     bali: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   }

//   return (
//     <div className="min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-blue-900 text-white">
//       {/* Hero Section with Parallax */}
//       <header ref={parallaxRef} className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
//         {/* Parallax stars background */}
//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black"></div>
//           <div 
//             className="stars-small absolute inset-0"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23404' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")`,
//               transform: `translateY(${scrollY * 0.1}px)`
//             }}
//           ></div>
//           <div 
//             className="stars-medium absolute inset-0"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23d4d4d4' fill-opacity='0.1'%3E%3Crect x='100' y='100' width='100' height='100'/%3E%3Crect x='0' y='100' width='100' height='100'/%3E%3Crect x='200' y='100' width='100' height='100'/%3E%3Crect x='100' y='0' width='100' height='100'/%3E%3Crect x='200' y='0' width='100' height='100'/%3E%3Crect x='0' y='0' width='100' height='100'/%3E%3Crect x='100' y='200' width='100' height='100'/%3E%3Crect x='0' y='200' width='100' height='100'/%3E%3Crect x='200' y='200' width='100' height='100'/%3E%3C/g%3E%3C/svg%3E")`,
//               transform: `translateY(${scrollY * 0.2}px)`
//             }}
//           ></div>
//         </div>

//         {/* Moving clouds */}
//         <div className="absolute inset-0 z-0 opacity-30">
//           <div className="cloud cloud-1"></div>
//           <div className="cloud cloud-2"></div>
//           <div className="cloud cloud-3"></div>
//         </div>

//         {/* 3D Rotating Globe */}
//         <div className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/4 hidden lg:block">
//           <div ref={globeContainerRef} className="globe-container">
//             {/* Three.js will render here */}
//           </div>
//         </div>
        
//         {/* Hero Content with Animations */}
//         <div 
//           className={`relative z-20 max-w-4xl mx-auto transform transition-all duration-1000 ease-out ${
//             isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
//           }`}
//         >
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-glow">
//             <span className="inline-block hover:scale-105 transition-transform duration-300">W</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">e</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">l</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">c</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">o</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">m</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">e</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300"> </span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">t</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300">o</span>
//             <span className="inline-block hover:scale-105 transition-transform duration-300"> </span>
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-pink-500 to-pink-500 animate-gradient-x inline-block">Travel Wizard</span>
//           </h1>
//           <h2 className="text-2xl md:text-3xl font-medium mb-10 text-blue-200 drop-shadow-glow animate-pulse-slow">
//             YOUR ULTIMATE TRAVEL COMPANION
//           </h2>
//           <button 
//             className="relative overflow-hidden group bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//             onClick={() => navigate("/explore")}
//           >
//             <span className="relative z-10">Explore Now</span>
//             <span className="absolute inset-0 bg-gradient-to-r from-pink-800 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//             <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse-fast"></span>
//           </button>
//         </div>

//         {/* Scroll indicator with animation */}
//         <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
//           <div className="flex flex-col items-center">
//             <span className="text-sm font-light mb-2">Scroll to explore</span>
//             <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
//               <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
//             </svg>
//           </div>
//         </div>
//       </header>
      
//       {/* Features Section with 3D Cards */}
//       <section className="max-w-6xl mx-auto py-20 px-4 observe-section opacity-0">
//         <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
//           Discover Your Next <span className="text-shadow-glow text-white">Adventure</span>
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {/* 3D Tilt Card 1 */}
//           <div className="group perspective">
//             <div className="relative preserve-3d bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-blue border border-blue-400/30 overflow-hidden transition-all duration-500 transform group-hover:rotate-y-6 hover:shadow-blue-glow">
//               <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
//               <div className="h-48 flex items-center justify-center p-8">
//                 <div className="relative w-24 h-24">
//                   <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping-slow"></div>
//                   <svg className="w-24 h-24 text-blue-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
//                   </svg>
//                 </div>
//               </div>
//               <div className="p-8 backdrop-blur-sm bg-blue-900/20">
//                 <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">Find Tours</h3>
//                 <p className="text-blue-100">Discover curated tours in the world's most breathtaking destinations. Expert guides, unforgettable experiences.</p>
//               </div>
//               <div className="card-shine"></div>
//             </div>
//           </div>
          
//           {/* 3D Tilt Card 2 */}
//           <div className="group perspective mt-10 md:mt-0">
//             <div className="relative preserve-3d bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl shadow-purple border border-purple-400/30 overflow-hidden transition-all duration-500 transform group-hover:rotate-y-6 hover:shadow-purple-glow">
//               <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
//               <div className="h-48 flex items-center justify-center p-8">
//                 <div className="relative w-24 h-24">
//                   <div className="absolute inset-0 bg-purple-400 rounded-full opacity-20 animate-ping-slow delay-150"></div>
//                   <svg className="w-24 h-24 text-purple-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                   </svg>
//                 </div>
//               </div>
//               <div className="p-8 backdrop-blur-sm bg-purple-900/20">
//                 <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">Plan Itineraries</h3>
//                 <p className="text-purple-100">Personalized travel plans tailored to your budget, interests, and schedule. Maximize every moment of your journey.</p>
//               </div>
//               <div className="card-shine"></div>
//             </div>
//           </div>
          
//           {/* 3D Tilt Card 3 */}
//           <div className="group perspective mt-10 md:mt-0">
//             <div className="relative preserve-3d bg-gradient-to-br from-pink-900 to-pink-700 rounded-xl shadow-pink border border-pink-400/30 overflow-hidden transition-all duration-500 transform group-hover:rotate-y-6 hover:shadow-pink-glow">
//               <div className="absolute inset-0 bg-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
//               <div className="h-48 flex items-center justify-center p-8">
//                 <div className="relative w-24 h-24">
//                   <div className="absolute inset-0 bg-pink-400 rounded-full opacity-20 animate-ping-slow delay-300"></div>
//                   <svg className="w-24 h-24 text-pink-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
//                   </svg>
//                 </div>
//               </div>
//               <div className="p-8 backdrop-blur-sm bg-pink-900/20">
//                 <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">Discover Events</h3>
//                 <p className="text-pink-100">From local festivals to hidden gems, stay updated on exciting events happening around your destination.</p>
//               </div>
//               <div className="card-shine"></div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Destinations Preview */}
//       <section className="py-20 px-4 bg-gradient-to-b from-blue-900 to-gray-900 observe-section opacity-0">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300">
//             Popular Destinations
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {/* Destination Card 1 */}
//             <div className="destination-card group">
//               <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
//                 <img 
//                   className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                   src={images.paris}
//                   alt="placeholder" 
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
//                   <h3 className="text-xl font-bold text-white mb-1">Paris</h3>
//                   <p className="text-sm text-gray-300">France</p>
//                 </div>
//                 <div className="absolute inset-0 bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
//               </div>
//             </div>
            
//             {/* Destination Card 2 */}
//             <div className="destination-card group">
//               <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
//                 <img 
//                   className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                   src={images.tokyo} 
//                   alt="placeholder" 
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
//                   <h3 className="text-xl font-bold text-white mb-1">Tokyo</h3>
//                   <p className="text-sm text-gray-300">Japan</p>
//                 </div>
//                 <div className="absolute inset-0 bg-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
//               </div>
//             </div>
            
//             {/* Destination Card 3 */}
//             <div className="destination-card group">
//               <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
//                 <img 
//                   className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                   src={images.newYork} 
//                   alt="placeholder" 
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
//                   <h3 className="text-xl font-bold text-white mb-1">New York</h3>
//                   <p className="text-sm text-gray-300">USA</p>
//                 </div>
//                 <div className="absolute inset-0 bg-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
//               </div>
//             </div>
            
//             {/* Destination Card 4 */}
//             <div className="destination-card group">
//               <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
//                 <img 
//                   className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                   src={images.bali} 
//                   alt="placeholder" 
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
//                   <h3 className="text-xl font-bold text-white mb-1">Bali</h3>
//                   <p className="text-sm text-gray-300">Indonesia</p>
//                 </div>
//                 <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="text-center mt-12">
//             <button 
//               className="relative overflow-hidden group bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               onClick={() => navigate("/destinations")}
//             >
//               <span className="relative z-10">View All Destinations</span>
//               <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//             </button>
//           </div>
//         </div>
//       </section>
      
//       {/* Testimonials Section */}
//       <section className="py-20 px-4 observe-section opacity-0">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
//             What Travelers Say
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Testimonial 1 */}
//             <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-purple-glow-sm">
//               <div className="flex items-center mb-4">
//                 <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold text-white mr-4">JD</div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-white">John Doe</h4>
//                   <p className="text-sm text-gray-400">Adventure Seeker</p>
//                 </div>
//               </div>
//               <p className="text-gray-300 italic">"Travel Wizard made planning my Europe trip so easy! The personalized itinerary was perfect, and I discovered places I never would have found on my own."</p>
//               <div className="mt-4 text-pink-400">★★★★★</div>
//             </div>
            
//             {/* Testimonial 2 */}
//             <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-blue-glow-sm">
//               <div className="flex items-center mb-4">
//                 <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white mr-4">JS</div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-white">Jane Smith</h4>
//                   <p className="text-sm text-gray-400">Family Traveler</p>
//                 </div>
//               </div>
//               <p className="text-gray-300 italic">"As a mom of three, planning vacations used to be stressful. This app helped me find family-friendly activities and accommodations that everyone loved!"</p>
//               <div className="mt-4 text-pink-400">★★★★★</div>
//             </div>
            
//             {/* Testimonial 3 */}
//             <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:shadow-pink-glow-sm">
//               <div className="flex items-center mb-4">
//                 <div className="h-12 w-12 rounded-full bg-pink-600 flex items-center justify-center text-xl font-bold text-white mr-4">RJ</div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-white">Robert Johnson</h4>
//                   <p className="text-sm text-gray-400">Business Traveler</p>
//                 </div>
//               </div>
//               <p className="text-gray-300 italic">"I travel for work constantly, and this app has been a game-changer. It helps me balance work meetings with exploring new cities in my free time."</p>
//               <div className="mt-4 text-pink-400">★★★★★</div>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       {/* Call to Action */}
//       <section className="py-20 px-4 bg-gradient-to-br from-purple-900 to-blue-900 observe-section opacity-0">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white text-shadow-glow">
//             Ready for Your Next Adventure?
//           </h2>
//           <p className="text-xl text-blue-200 mb-12">Join thousands of happy travelers and start planning your dream journey today</p>
//           <button 
//             className="relative overflow-hidden group bg-gradient-to-br from-pink-400 to-orange-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//             onClick={() => navigate("/signup")}
//           >
//             <span className="relative z-10">Get Started for Free</span>
//             <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//             <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse-fast"></span>
//           </button>
//         </div>
//       </section>
      
//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-400 py-12 px-4">
//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-xl font-bold text-white mb-4">Travel Wizard</h3>
//             <p className="mb-4">Your ultimate travel companion for discovering and planning unforgettable journeys around the world.</p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                   <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                   <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                   <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
//                 </svg>
//               </a>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Tours</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Activities</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="text-white font-semibold mb-4">Support</h4>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="text-white font-semibold mb-4">Subscribe</h4>
//             <p className="mb-4">Get the latest travel deals and updates straight to your inbox.</p>
//             <div className="flex">
//               <input 
//                 type="email" 
//                 placeholder="Your email" 
//                 className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//               />
//               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
//           <p>&copy; {new Date().getFullYear()} Travel Wizard. All rights reserved.</p>
//         </div>
//       </footer>
      
//       {/* CSS for animations and effects */}
//       <style jsx>{`
//         .text-shadow-glow {
//           text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
//         }
        
//         .drop-shadow-glow {
//           filter: drop-shadow(0 0 8px rgba(191, 219, 254, 0.5));
//         }
        
//         .shadow-blue {
//           box-shadow: 0 4px 20px -5px rgba(59, 130, 246, 0.5);
//         }
        
//         .shadow-purple {
//           box-shadow: 0 4px 20px -5px rgba(139, 92, 246, 0.5);
//         }
        
//         .shadow-pink {
//           box-shadow: 0 4px 20px -5px rgba(236, 72, 153, 0.5);
//         }
        
//         .shadow-blue-glow {
//           box-shadow: 0 0 25px -5px rgba(59, 130, 246, 0.6);
//         }
        
//         .shadow-purple-glow {
//           box-shadow: 0 0 25px -5px rgba(139, 92, 246, 0.6);
//         }
        
//         .shadow-pink-glow {
//           box-shadow: 0 0 25px -5px rgba(236, 72, 153, 0.6);
//         }
        
//         .shadow-blue-glow-sm {
//           box-shadow: 0 0 15px -5px rgba(59, 130, 246, 0.5);
//         }
        
//         .shadow-purple-glow-sm {
//           box-shadow: 0 0 15px -5px rgba(139, 92, 246, 0.5);
//         }
        
//         .shadow-pink-glow-sm {
//           box-shadow: 0 0 15px -5px rgba(236, 72, 153, 0.5);
//         }
        
//         .card-shine {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(
//             135deg,
//             rgba(255, 255, 255, 0) 0%,
//             rgba(255, 255, 255, 0.02) 40%,
//             rgba(255, 255, 255, 0.1) 50%,
//             rgba(255, 255, 255, 0.02) 60%,
//             rgba(255, 255, 255, 0) 100%
//           );
//           transform: translateY(100%);
//           transition: transform 0.6s ease;
//           pointer-events: none;
//         }
        
//         .preserve-3d:hover .card-shine {
//           transform: translateY(-100%);
//         }
        
//         .perspective {
//           perspective: 1000px;
//         }
        
//         .preserve-3d {
//           transform-style: preserve-3d;
//         }
        
//         .animate-gradient-x {
//           background-size: 200% 200%;
//           animation: gradientFlow 3s ease infinite alternate;
//         }
        
//         .animate-pulse-slow {
//           animation: pulseSlow 5s ease-in-out infinite;
//         }
        
//         .animate-pulse-fast {
//           animation: pulseFast 1s ease-in-out infinite;
//         }
        
//         .animate-ping-slow {
//           animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
//         }
        
//         .delay-150 {
//           animation-delay: 0.15s;
//         }
        
//         .delay-300 {
//           animation-delay: 0.3s;
//         }
        
//         .animate-reveal {
//           animation: reveal 0.8s ease forwards;
//         }
        
//         /* Moving clouds */
//         .cloud {
//           position: absolute;
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 50%;
//           position: absolute;
//         }

//         .cloud:before,
//         .cloud:after {
//           content: '';
//           position: absolute;
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 50%;
//         }

//         .cloud-1 {
//           width: 200px;
//           height: 60px;
//           top: 20%;
//           left: -100px;
//           animation: cloudMove 80s linear infinite;
//         }

//         .cloud-1:before {
//           width: 100px;
//           height: 100px;
//           top: -50px;
//           left: 25px;
//         }

//         .cloud-1:after {
//           width: 80px;
//           height: 80px;
//           top: -30px;
//           left: 90px;
//         }

//         .cloud-2 {
//           width: 280px;
//           height: 70px;
//           top: 40%;
//           left: -200px;
//           animation: cloudMove 100s linear infinite;
//           animation-delay: -20s;
//         }

//         .cloud-2:before {
//           width: 120px;
//           height: 120px;
//           top: -60px;
//           left: 50px;
//         }

//         .cloud-2:after {
//           width: 100px;
//           height: 100px;
//           top: -40px;
//           left: 130px;
//         }

//         .cloud-3 {
//           width: 220px;
//           height: 60px;
//           top: 60%;
//           left: -150px;
//           animation: cloudMove 90s linear infinite;
//           animation-delay: -50s;
//         }

//         .cloud-3:before {
//           width: 90px;
//           height: 90px;
//           top: -45px;
//           left: 40px;
//         }

//         .cloud-3:after {
//           width: 70px;
//           height: 70px;
//           top: -30px;
//           left: 110px;
//         }

//         @keyframes cloudMove {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(calc(100vw + 400px));
//           }
//         }
        
//         @keyframes gradientFlow {
//           0% {
//             background-position: 0% 50%;
//           }
//           100% {
//             background-position: 100% 50%;
//           }
//         }
        
//         @keyframes pulseSlow {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.8;
//           }
//         }
        
//         @keyframes pulseFast {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }
        
//         @keyframes pingSlow {
//           0% {
//             transform: scale(1);
//             opacity: 0.8;
//           }
//           70%, 100% {
//             transform: scale(1.3);
//             opacity: 0;
//           }
//         }
        
//         @keyframes reveal {
//           0% {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
        
//       `}</style>
//     </div>
//   );
// };




import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const parallaxRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial visibility after a short delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  const image1 = "https://images.unsplash.com/photo-1579689189009-874f5cac2db5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxNYW5hbGl8ZW58MHx8fHwxNzQzODU5NjYzfDA&ixlib=rb-4.0.3&q=85";
  const image2 = "https://images.unsplash.com/photo-1561361058-c24cecae35ca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw0fHxWYXJhbmFzaXxlbnwwfHx8fDE3NDM4NTk2Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image3 = "https://images.unsplash.com/photo-1589738611537-4c1b6a28158a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzM0Mzd8MHwxfHNlYXJjaHw4fHxEZWhyYWR1bnxlbnwwfHx8fDE3NDM4NjA0Nzl8MA&ixlib=rb-4.0.3&q=85"
  const image4 = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MzMwODh8MHwxfHNlYXJjaHw4fHxNdW1iYWl8ZW58MHx8fHwxNzQzODU5Njc5fDA&ixlib=rb-4.0.3&q=85"
  
  // Mock data for popular destinations
  const destinations = [
    { id: 1, name: "Manali", state: "Himachal Pradesh", description: "Most popular hill stations in Himachal", image: image1 },
    { id: 2, name: "Varanasi", state: "Uttar Pradesh", description: "The Big Apple", image: image2 },
    { id: 3, name: "Dehradun", state: "Himachal Pradesh", description: "The Heart of Japan", image: image3 },
    { id: 4, name: "Mumbai", state: "Maharashtra", description: "A Beautiful Harbour City", image: image4 },
  ];


  const images = {
    heroBackground: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with actual hero image URL
  }



  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Hero Section with Simple Background */}
      <header ref={parallaxRef} className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40"></div>
          <img 
            src={images.heroBackground} 
            alt="Scenic travel destination" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content with Animations */}
        <div 
          className={`relative z-20 max-w-4xl mx-auto transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Welcome to <span className="font-extrabold">Travel Wizard</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-10 text-pink-100">
            YOUR ULTIMATE TRAVEL COMPANION
          </h2>
          <button 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-10 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate("/explore")}
          >
            Explore Now
          </button>
        </div>

        {/* Scroll indicator with animation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm font-light mb-2 text-white">Scroll to explore</span>
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </header>
      
      {/* Features Section with Simple Cards */}
      <section className="max-w-6xl mx-auto py-20 px-4 observe-section opacity-0 bg-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
          Discover Your Next <span className="text-pink-500">Adventure</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Tours</h3>
              <p className="text-gray-600">Discover curated tours in the world's most breathtaking destinations. Expert guides, unforgettable experiences.</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan Itineraries</h3>
              <p className="text-gray-600">Personalized travel plans tailored to your budget, interests, and schedule. Maximize every moment of your journey.</p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="h-48 flex items-center justify-center p-8 bg-pink-50">
              <svg className="w-24 h-24 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Events</h3>
              <p className="text-gray-600">From local festivals to hidden gems, stay updated on exciting events happening around your destination.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Destinations Preview */}
      <section className="py-20 px-4 bg-gray-100 observe-section opacity-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Popular <span className="text-pink-500">Destinations</span>
          </h2>
          
          <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Destination Card 1 */}
                        {destinations.map((destination) => (

            <div 
                key={destination.name} // 👈 Add this line
            onClick={() => {navigate(`/city/${destination.name}`)}}
            className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={destination.image}
                  alt={`${destination.name} `} 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-300">{destination.state}</p>
                </div>
              </div>
            </div>
                        ))}
            
            {/* Destination Card 2 */}
            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.tokyo} 
                  alt="Tokyo, Japan" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">Tokyo</h3>
                  <p className="text-sm text-gray-300">Japan</p>
                </div>
              </div>
            </div> */}
            
            {/* Destination Card 3 */}
            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.newYork} 
                  alt="New York, USA" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">New York</h3>
                  <p className="text-sm text-gray-300">USA</p>
                </div>
              </div>
            </div> */}
            
            {/* Destination Card 4 */}

            {/* <div className="destination-card group">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img 
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={images.bali} 
                  alt="Bali, Indonesia" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">Bali</h3>
                  <p className="text-sm text-gray-300">Indonesia</p>
                </div>
              </div>
            </div> */}

          </div>
          
          <div className="text-center mt-12">
            <button 
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/explore")}
            >
              View All Destinations
            </button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 observe-section opacity-0 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            What <span className="text-pink-500">Travelers Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">JD</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-500">Adventure Seeker</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"Travel Wizard made planning my Europe trip so easy! The personalized itinerary was perfect, and I discovered places I never would have found on my own."</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">JS</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"As a mom of three, planning vacations used to be stressful. This app helped me find family-friendly activities and accommodations that everyone loved!"</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">RJ</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"I travel for work constantly, and this app has been a game-changer. It helps me balance work meetings with exploring new cities in my free time."</p>
              <div className="mt-4 text-pink-500">★★★★★</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-900 observe-section opacity-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-pink-50 mb-12">Join thousands of happy travelers and start planning your dream journey today</p>
          <button 
            className="bg-white hover:bg-gray-100 text-pink-600 font-bold py-4 px-10 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate("/explore")}
          >
            Get Started for Free
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Travel Wizard</h3>
            <p className="mb-4">Your ultimate travel companion for discovering and planning unforgettable journeys around the world.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100023434373256" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="https://x.com/vaibhav5104" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Home</a></li>
              <li><a href="/explore" className="hover:text-pink-500 transition-colors">Destinations</a></li>
              <li><a href="/city" className="hover:text-pink-500 transition-colors">Tours</a></li>
              <li><a href="city" className="hover:text-pink-500 transition-colors">Hotels</a></li>
              <li><a href="events" className="hover:text-pink-500 transition-colors">Activities</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-pink-500 transition-colors">FAQs</a></li>
              <li><a href="/contact" className="hover:text-pink-500 transition-colors">Contact Us</a></li>
              <li><a href="/about" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
              <li><a href="about" className="hover:text-pink-500 transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-pink-500 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Subscribe</h4>
            <p className="mb-4">Get the latest travel deals and updates straight to your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-gray-200 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
              />
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-r-md transition-colors" >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Travel Wizard. All rights reserved.</p>
        </div>
      </footer>
      
      {/* CSS for animations and effects - simplified */}
      <style jsx>{`
        .animate-reveal {
          animation: reveal 0.8s ease forwards;
        }
        
        @keyframes reveal {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};