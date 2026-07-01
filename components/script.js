$(document).ready(function(){
    // Sticky navbar toggle on scroll
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // Scroll-up button visibility
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // Scroll back to top on click
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });

    // Smooth scroll and auto-close menu for mobile
    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
        $('.navbar .menu').removeClass("active");
        $('.menu-btn i').removeClass("active");
    });

    // Toggle menu/navbar hamburger click
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // Typing text animations (using Typed.js)
    if ($(".typing").length) {
        new Typed(".typing", {
            strings: ["MERN Stack Developer", "React Native Developer", "Mobile App Developer", "Full Stack Developer"],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }

    // Initialize Three.js interactive constellation particles
    initThreeParticles();

    // Initialize VanillaTilt for 3D card tilts
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 12,
            speed: 500,
            glare: true,
            "max-glare": 0.15,
            gyroscope: true
        });
    }

    // About Section Tabs Handler
    $('.tab-btn').click(function(){
        const tabId = $(this).attr('data-tab');
        
        // Remove active class from buttons and contents
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        
        // Add active class to clicked button and target tab
        $(this).addClass('active');
        $('#tab-' + tabId).addClass('active');
    });

    // Contact Form Submission Handler
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default page-refresh form submission

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get("name"),
                email: formData.get("email"),
                subject: document.querySelector("#subject")?.value || "",
                message: formData.get("message")
            };

            fetch("/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server responded with error status");
                }
                return response.json();
            })
            .then(result => {
                if (result.message === 'Email sent successfully!') {
                    alert('Your message has been sent successfully!');
                    contactForm.reset();
                    if (document.querySelector("#subject")) {
                        document.querySelector("#subject").value = "";
                    }
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            });
        });
    }

    // Owl Carousel configuration
    if ($('.carousel').length) {
        $('.carousel').owlCarousel({
            margin: 20,
            loop: true,
            autoplay: true,
            autoplayTimeOut: 2000,
            autoplayHoverPause: true,
            responsive: {
                0:{
                    items: 1,
                    nav: false
                },
                600:{
                    items: 2,
                    nav: false
                },
                1000:{
                    items: 3,
                    nav: false
                }
            }
        });
    }
});

// Three.js Interactive Particle Background Engine
function initThreeParticles() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 35;

    // 3. Particle Constellation Geometry
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 90;     // X-axis spread
        positions[i + 1] = (Math.random() - 0.5) * 90; // Y-axis spread
        positions[i + 2] = (Math.random() - 0.5) * 60; // Z-axis spread
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 4. Generate Particle Glowing Texture
    const createGlowingParticleTexture = () => {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 16;
        textureCanvas.height = 16;
        const ctx = textureCanvas.getContext('2d');
        
        // Radial gradient glow
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)'); // Cyan glow color
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');     // Fade to purple glow transparency
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(textureCanvas);
    };

    // 5. Particle Material Setup
    const material = new THREE.PointsMaterial({
        size: 0.9,
        map: createGlowingParticleTexture(),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // 6. Mesh Assembly & Addition
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 7. Viewport Mouse Interactive Coordinates Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        // Calculate offset from center of viewport
        mouseX = (event.clientX - window.innerWidth / 2) / 120;
        mouseY = (event.clientY - window.innerHeight / 2) / 120;
    });

    // 8. Animation Update Loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Constant orbit rotation
        particlesMesh.rotation.y = elapsedTime * 0.04;
        particlesMesh.rotation.x = elapsedTime * 0.015;

        // Smooth translation interpolation (lerp) toward mouse target coordinates
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particlesMesh.position.x = targetX;
        particlesMesh.position.y = -targetY;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Aspect Ratio Calculator
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
